from flask import Blueprint, request, jsonify
from models.submission import Submission
from models.user import User
from mongoengine.errors import ValidationError, DoesNotExist, InvalidQueryError, OperationError
from bson import ObjectId
import uuid
import traceback
import sys
import json
import os

# Import the AI evaluation service
from services.ai_evaluation_service import evaluate_code_submission, generate_optimal_solution

submission_bp = Blueprint('submission', __name__)

@submission_bp.route('/api/submission/create', methods=['POST'])
def create_submission():
    # Generate a unique submission ID early
    submission_id = str(uuid.uuid4())
    
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Check required fields
        required_fields = ['user_id', 'question_id', 'username', 'llm_response']
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Print debugging info
        print(f"Processing submission with user_id: {data.get('user_id')}", file=sys.stderr)
        
        # Verify user exists before creating submission
        try:
            user_id = data.get('user_id')
            # Try to find the user first
            user = User.objects.get(id=user_id)
            print(f"User found: {user.username}", file=sys.stderr)
        except DoesNotExist:
            return jsonify({"error": f"User with ID {user_id} not found"}), 404
        except InvalidQueryError:
            return jsonify({"error": f"Invalid user ID format: {user_id}"}), 400
        except Exception as e:
            print(f"Error finding user: {str(e)}", file=sys.stderr)
            return jsonify({"error": f"Error finding user: {str(e)}"}), 500
            
        # Get the question details to pass to the AI evaluation service
        question_id = data.get('question_id')
        llm_response = data.get('llm_response')
        
        try:
            # Load the questions from the JSON file to get the context and design pattern
            current_dir = os.path.dirname(__file__)
            file_path = os.path.join(current_dir, '..', 'questions.json')
            
            with open(file_path, 'r') as file:
                questions = json.load(file)
                
            # Find the question with matching ID
            question = None
            for q in questions:
                if str(q['question_id']) == str(question_id):
                    question = q
                    break
                    
            if not question:
                print(f"Question with ID {question_id} not found in questions.json", file=sys.stderr)
                return jsonify({"error": f"Question with ID {question_id} not found"}), 404
                
            # Get the context and design pattern
            context = question.get('context', '')
            design_pattern = question.get('design_pattern', '')
            
            # Call the AI evaluation service
            print(f"Calling AI evaluation for design pattern: {design_pattern}", file=sys.stderr)
            evaluation_result = evaluate_code_submission(
                user_code=llm_response,
                question_context=context,
                design_pattern=design_pattern
            )
            
            # Extract score and evaluation data
            score = evaluation_result.get('score', 70)  # Default to 70 if missing
            evaluation_data = evaluation_result.get('evaluation_data', {})
            
            print(f"AI evaluation completed with score: {score}", file=sys.stderr)
            
        except Exception as e:
            print(f"Error getting question details or evaluating code: {str(e)}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            
            # Fall back to default values if evaluation fails
            score = 70
            evaluation_data = {
                'strengths': [
                    "Submission was processed",
                    "Error occurred during advanced evaluation"
                ],
                'improvements': [
                    "Error in evaluation process, please try again later"
                ]
            }
        
        # Also generate an optimal solution to store with the submission
        optimal_solution = ""
        try:
            # Check if there's already a solution for this question
            existing_submission_with_solution = Submission.objects(
                question_id=str(question_id), 
                optimal_solution__ne=""
            ).first()
            
            if existing_submission_with_solution and existing_submission_with_solution.optimal_solution:
                # Reuse existing solution
                optimal_solution = existing_submission_with_solution.optimal_solution
                print(f"Reusing existing optimal solution for question {question_id}", file=sys.stderr)
            else:
                # Generate a new solution
                optimal_solution = generate_optimal_solution(context, design_pattern)
                print(f"Generated new optimal solution for question {question_id}", file=sys.stderr)
        except Exception as e:
            print(f"Error generating optimal solution during submission: {str(e)}", file=sys.stderr)
            # Continue without the solution if there's an error
        
        # Create the submission directly with all required fields to avoid null issues
        try:
            # Truncate llm_response if it's too long (assuming MongoDB has a limit)
            max_length = 16777216  # MongoDB document size limit is 16MB
            if len(llm_response) > max_length:
                llm_response = llm_response[:max_length]
                
            # Create submission with all fields explicitly set at creation time
            submission = Submission(
                user_id=user,
                question_id=question_id,
                username=data.get('username'),
                score=score,
                llm_response=llm_response,
                submission_id=submission_id,  # Use the UUID generated at the beginning
                evaluation_data=evaluation_data,
                optimal_solution=optimal_solution  # Save the optimal solution
            )
            
            # Verify submission_id is set before saving
            if not submission.submission_id:
                return jsonify({"error": "Failed to generate submission ID"}), 500
                
            # Skip index validation and just save the document
            try:
                # Try the normal save first
                submission.validate()
                submission.save()
                print(f"Submission saved with ID: {submission_id}", file=sys.stderr)
            except OperationError as e:
                # If it's an index error, try a direct insert with PyMongo
                if "IndexKeySpecsConflict" in str(e) or "duplicate key error" in str(e):
                    print("Index conflict detected, trying direct insert...", file=sys.stderr)
                    
                    # Convert the document to a dictionary for direct insertion
                    doc_dict = submission.to_mongo().to_dict()
                    
                    # Get the collection and insert directly
                    collection = Submission._get_collection()
                    result = collection.insert_one(doc_dict)
                    
                    if not result.inserted_id:
                        raise Exception("Failed to insert document")
                        
                    print(f"Submission saved with direct insert: {submission_id}", file=sys.stderr)
                else:
                    # If it's not an index error, re-raise
                    raise e
            
        except OperationError as e:
            print(f"MongoDB operation error: {str(e)}", file=sys.stderr)
            return jsonify({"error": f"Database operation error: {str(e)}"}), 500
        except Exception as e:
            print(traceback.format_exc(), file=sys.stderr)
            return jsonify({"error": f"Error saving submission: {str(e)}"}), 500
        
        # Calculate rating change (score - threshold)
        threshold = 70
        rating_change = score - threshold
        old_rating = user.rating
        
        # Update the user's rating
        try:
            # Calculate new rating and ensure it doesn't go below 0
            new_rating = user.rating + rating_change
            new_rating = max(0, new_rating)  # Ensure rating doesn't go below 0
            user.rating = round(new_rating, 1)
            
            # Ensure the last_5_ratings field exists and is a list
            if not hasattr(user, 'last_5_ratings') or user.last_5_ratings is None:
                print(f"Initializing empty last_5_ratings for user {user.username}", file=sys.stderr)
                user.last_5_ratings = []
            
            # Ensure we're working with a list
            if not isinstance(user.last_5_ratings, list):
                print(f"Converting last_5_ratings to list for user {user.username}", file=sys.stderr)
                # Try to convert to list or initialize as empty
                try:
                    user.last_5_ratings = list(user.last_5_ratings)
                except:
                    user.last_5_ratings = []
            
            # Update the last_5_ratings list with the new rating
            if len(user.last_5_ratings) >= 5:
                user.last_5_ratings.pop(0)  # Remove the oldest rating
            
            # Explicitly add as float to avoid type issues
            user.last_5_ratings.append(float(user.rating))
            
            # Debug logs to verify values
            print(f"Adding rating {user.rating} to last_5_ratings, now: {user.last_5_ratings}", file=sys.stderr)
            
            # Update the user's completed challenges and last_3_submissions
            # Only add the challenge if it's not already in the completed list
            if question_id not in user.completed_challenges:
                user.completed_challenges.append(question_id)
            
            # Update last_3_submissions with submission_id
            if len(user.last_3_submissions) >= 3:
                user.last_3_submissions.pop(0)  # Remove the oldest
            user.last_3_submissions.append(submission_id)
            
            # Save the user data and verify it worked - use force_insert=False to allow updates
            user.save(force_insert=False)
            
            # Verify the user data was saved correctly by reading it back
            updated_user = User.objects.get(id=user.id)
            print(f"User {user.username} updated with rating change {rating_change}", file=sys.stderr)
            print(f"User's last_5_ratings now: {updated_user.last_5_ratings}", file=sys.stderr)
            
        except Exception as e:
            # Log the error but still continue
            print(f"Error updating user data: {str(e)}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)  # Print the full traceback for debugging
        
        return jsonify({
            "message": "Submission created successfully",
            "submission_id": submission_id,
            "score": score,
            "rating_change": rating_change,
            "old_rating": old_rating,
            "new_rating": user.rating
        }), 201
        
    except ValidationError as e:
        print(f"Validation error: {str(e)}", file=sys.stderr)
        return jsonify({"error": f"Validation error: {str(e)}"}), 400
    except Exception as e:
        print(traceback.format_exc(), file=sys.stderr)  # Print detailed traceback for debugging
        return jsonify({"error": f"Error processing submission: {str(e)}"}), 500

@submission_bp.route('/api/submission/<submission_id>', methods=['GET'])
def get_submission(submission_id):
    try:
        submission = Submission.objects.get(submission_id=submission_id)
        # Also get the user's rating at the time of viewing submission
        user = User.objects.get(id=submission.user_id.id)
        
        return jsonify({
            'submission_id': submission.submission_id,
            'user_id': str(submission.user_id.id),
            'question_id': submission.question_id,
            'username': submission.username,
            'score': submission.score,
            'llm_response': submission.llm_response,
            'evaluation_data': submission.evaluation_data,
            'current_rating': user.rating
        }), 200
    except DoesNotExist:
        return jsonify({'error': 'Submission not found'}), 404
    except Exception as e:
        print(traceback.format_exc(), file=sys.stderr)  # Print detailed traceback for debugging
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

@submission_bp.route('/api/llm-solution/<question_id>', methods=['GET'])
def get_llm_solution(question_id):
    try:
        # Get the question details from questions.json
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, '..', 'questions.json')
        
        with open(file_path, 'r') as file:
            questions = json.load(file)
            
        # Find the question with matching ID
        question = None
        for q in questions:
            if str(q['question_id']) == str(question_id):
                question = q
                break
                
        if not question:
            return jsonify({"error": f"Question with ID {question_id} not found"}), 404
            
        # Get the context and design pattern
        context = question.get('context', '')
        design_pattern = question.get('design_pattern', '')
        
        # Generate an optimal solution
        print(f"Generating new optimal solution for question {question_id} ({design_pattern})", file=sys.stderr)
        solution = generate_optimal_solution(context, design_pattern)
        
        # Save this solution in the database for future use
        try:
            # First try to find any submission for this question
            existing_submission = Submission.objects(question_id=str(question_id)).first()
            
            if existing_submission:
                # Update this submission with the solution
                existing_submission.optimal_solution = solution
                existing_submission.save()
                print(f"Updated existing submission with optimal solution", file=sys.stderr)
            else:
                # If no submission exists yet for this question, we'll just return the solution
                # It will be saved when a user actually makes a submission
                print(f"No existing submission found for question {question_id}, solution will be returned only", file=sys.stderr)
        except Exception as e:
            print(f"Error saving optimal solution: {str(e)}", file=sys.stderr)
            # Continue and at least return the solution even if we couldn't save it
        
        return jsonify({
            "solution": solution,
            "design_pattern": design_pattern,
            "from_cache": False
        }), 200
        
    except Exception as e:
        print(f"Error generating LLM solution: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return jsonify({"error": str(e)}), 500