from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from mongoengine.errors import DoesNotExist
from flask_cors import cross_origin

# Create a blueprint for the learning route
learning_bp = Blueprint('learning', __name__)

@learning_bp.route('/learning', methods=['GET'])
def learning():
    user_id = request.headers.get('id')  # Extract user ID from the request headers
    if not user_id:
        return jsonify({"error": "User ID is missing in the headers"}), 400

    try:
        # Example response for the learning route
        return jsonify({
            "id": user_id,
            "message": "Welcome to the Learning section!",
            "resources": ["Python Basics", "Data Structures", "Algorithms"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@learning_bp.route('/learning/complete-lesson', methods=['POST', 'OPTIONS'])
@cross_origin()
@jwt_required(optional=True)  # Make JWT optional for OPTIONS requests
def complete_lesson():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    # Regular POST handling
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        lesson_id = data.get('lesson_id')
        
        if not lesson_id:
            return jsonify({"error": "Lesson ID is required"}), 400
            
        # Find the user
        user = User.objects.get(id=current_user_id)
        
        # Create completed_lessons field if it doesn't exist
        if not hasattr(user, 'completed_lessons') or user.completed_lessons is None:
            user.completed_lessons = []
            
        # Check if lesson has already been completed
        if lesson_id in user.completed_lessons:
            return jsonify({
                "success": True,
                "message": "Lesson already completed",
                "completed_lesson_count": user.completed_lesson_count,
                "alreadyCompleted": True
            })
        
        # Add to completed lessons list and increment counter
        user.completed_lessons.append(lesson_id)
        user.completed_lesson_count = user.completed_lesson_count + 1
        
        # Save the updated user
        user.save()
        
        return jsonify({
            "success": True,
            "message": "Lesson completed successfully",
            "completed_lesson_count": user.completed_lesson_count,
            "alreadyCompleted": False
        })
        
    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Complete lesson error: {e}")
        return jsonify({"error": str(e)}), 500