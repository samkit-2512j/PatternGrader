from flask import Blueprint, request, jsonify
import json
import sys
import random
import os
from models.user import User
from mongoengine.errors import DoesNotExist

competitive_bp = Blueprint('competitive', __name__)

@competitive_bp.route('/competitive', methods=['GET'])
def competitive():
    user_id = request.headers.get('id')
    if not user_id:
        return jsonify({"error": "User ID is missing in the headers"}), 400

    try:
        return jsonify({
            "id": user_id,
            "message": "Welcome to the Competitive Programming section!",
            "challenges": ["Codeforces", "LeetCode", "HackerRank"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Change the route to match what the frontend is expecting
@competitive_bp.route('/api/question/<topic>', methods=['GET', 'OPTIONS'])
def get_question(topic):
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response
        
    try:
        # Get user ID from request
        user_id = request.headers.get('id')
        if not user_id:
            return jsonify({"error": "User ID is missing in the headers"}), 400
            
        # Load questions from the JSON file
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, '..', 'questions.json')
        
        with open(file_path, 'r') as file:
            questions = json.load(file)
        
        # Get the user's completed challenges
        try:
            user = User.objects.get(id=user_id)
            completed_challenges = user.completed_challenges
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            # If there's an error fetching the user, proceed without filtering
            completed_challenges = []
        
        # Filter questions by topic or select any for weekly challenges
        if topic.startswith('this-week') or topic.startswith('last-week'):
            # For weekly challenges, pick any question
            filtered_questions = questions
        else:
            # Filter questions by the specified design pattern
            filtered_questions = [q for q in questions if q['design_pattern'] == topic]
        
        # Further filter out questions the user has already completed
        # Only filter if not a weekly challenge or if explicitly requested
        avoid_completed = request.args.get('avoid_completed', 'true').lower() == 'true'
        if avoid_completed and not (topic.startswith('this-week') or topic.startswith('last-week')):
            filtered_questions = [q for q in filtered_questions 
                                  if str(q['question_id']) not in completed_challenges]
            
            # If all questions are completed, fall back to all questions of this topic
            if not filtered_questions:
                filtered_questions = [q for q in questions if q['design_pattern'] == topic]
        
        if not filtered_questions:
            return jsonify({"error": f"No questions found for topic: {topic}"}), 404
        
        # Select a random question
        selected_question = random.choice(filtered_questions)
        
        # Add CORS headers to response
        response = jsonify({
            "question": selected_question
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@competitive_bp.route('/api/user/completed-challenges', methods=['GET', 'OPTIONS'])
def get_completed_challenges():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response
    
    try:
        # Get user ID from request
        user_id = request.headers.get('id')
        if not user_id:
            return jsonify({"error": "User ID is missing in the headers"}), 400

        # Get the user's completed challenges
        try:
            user = User.objects.get(id=user_id)
            completed_challenges = user.completed_challenges
            
            # Get user rating information with explicit type conversion
            user_rating = float(user.rating) if user.rating is not None else 0.0
            
            # Initialize rating_history with a more robust approach
            rating_history = []
            
            if hasattr(user, 'last_5_ratings') and user.last_5_ratings:
                # Convert each rating to float with explicit error handling
                for r in user.last_5_ratings:
                    try:
                        if isinstance(r, (int, float)):
                            rating_history.append(float(r))
                        elif isinstance(r, str):
                            rating_history.append(float(r))
                        else:
                            # For MongoDB special types or other objects, convert to string then float
                            rating_history.append(float(str(r)))
                    except (ValueError, TypeError) as e:
                        print(f"Error converting rating value {r}: {e}", file=sys.stderr)
                        # Skip invalid values
                
                print(f"User {user.username} has rating history: {rating_history}", file=sys.stderr)
            else:
                # If no history, use current rating as the only point
                if user.rating is not None:
                    rating_history = [float(user.rating)]
                    print(f"User {user.username} has no rating history, using current rating", file=sys.stderr)
                else:
                    rating_history = []
                    print(f"User {user.username} has no rating or history", file=sys.stderr)
            
            # Load questions from the JSON file to get topic information
            current_dir = os.path.dirname(__file__)
            file_path = os.path.join(current_dir, '..', 'questions.json')
            
            with open(file_path, 'r') as file:
                questions = json.load(file)
            
            # Group questions by topic
            topics = {}
            for question in questions:
                topic = question['design_pattern']
                if topic not in topics:
                    topics[topic] = {
                        'total': 0,
                        'completed': 0,
                        'questions': []
                    }
                
                topics[topic]['total'] += 1
                question_completed = str(question['question_id']) in completed_challenges
                
                if question_completed:
                    topics[topic]['completed'] += 1
                
                topics[topic]['questions'].append({
                    'id': question['question_id'],
                    'completed': question_completed
                })
            
            # Calculate topic completion status
            for topic in topics:
                topics[topic]['isCompleted'] = topics[topic]['completed'] == topics[topic]['total']
            
            response = jsonify({
                'completed_challenges': completed_challenges,
                'topics': topics,
                'user_rating': user_rating,
                'last_5_ratings': rating_history,  # Now correctly processed
                'debug_info': f"User {user.username} has rating {user_rating} and history {rating_history}"
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
            
            return response
            
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add a new route to get user rating history specifically
@competitive_bp.route('/api/user/rating-history', methods=['GET', 'OPTIONS'])
def get_rating_history():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response
    
    try:
        # Get user ID from request
        user_id = request.headers.get('id')
        if not user_id:
            return jsonify({"error": "User ID is missing in the headers"}), 400

        try:
            user = User.objects.get(id=user_id)
            
            response = jsonify({
                'rating': user.rating,
                'last_5_ratings': user.last_5_ratings
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
            
            return response
            
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add new endpoint to fetch question by ID
@competitive_bp.route('/api/question-by-id/<question_id>', methods=['GET', 'OPTIONS'])
def get_question_by_id(question_id):
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response
        
    try:
        # Get user ID from request
        user_id = request.headers.get('id')
        if not user_id:
            return jsonify({"error": "User ID is missing in the headers"}), 400
            
        # Load questions from the JSON file
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, '..', 'questions.json')
        
        with open(file_path, 'r') as file:
            questions = json.load(file)
        
        # Find the question with the matching ID
        question_id_str = str(question_id)  # Convert to string for comparison
        matching_question = None
        
        for question in questions:
            if str(question['question_id']) == question_id_str:
                matching_question = question
                break
        
        if not matching_question:
            return jsonify({"error": f"Question with ID {question_id} not found"}), 404
        
        # Add CORS headers to response
        response = jsonify({
            "question": matching_question
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,id')
        
        return response
        
    except Exception as e:
        print(f"Error fetching question by ID: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500

# Add debugging endpoint for rating history
@competitive_bp.route('/api/debug/user-ratings', methods=['GET'])
def debug_user_ratings():
    try:
        # Get user ID from request
        user_id = request.headers.get('id')
        if not user_id:
            return jsonify({"error": "User ID is missing in the headers"}), 400
            
        try:
            # Get user and examine their rating history directly
            user = User.objects.get(id=user_id)
            
            # Return detailed information about the user's ratings
            return jsonify({
                "username": user.username,
                "rating": user.rating,
                "last_5_ratings_raw": user.last_5_ratings,
                "last_5_ratings_processed": [float(r) if r is not None else 0 for r in (user.last_5_ratings or [])],
                "has_last_5_ratings_field": hasattr(user, 'last_5_ratings'),
                "last_5_ratings_type": str(type(user.last_5_ratings)) if hasattr(user, 'last_5_ratings') else "field missing"
            })
            
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500