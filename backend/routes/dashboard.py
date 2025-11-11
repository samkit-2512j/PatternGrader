from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        # Get current user from JWT token
        current_user_id = get_jwt_identity()
        
        # Fetch user from database
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get values with defaults for None values
        completed_lesson_count = getattr(user, 'completed_lesson_count', 0) or 0
        rating = getattr(user, 'rating', 0) or 0
        last_5_ratings = getattr(user, 'last_5_ratings', []) or []
        
        # Calculate learning progress based on completed lessons
        total_lessons = 15  # Updated total lessons to 15
        learning_progress = 0
        if total_lessons > 0:
            learning_progress = min(100, int((completed_lesson_count / total_lessons * 100)))
        
        # Challenge progress is based on rating
        challenge_progress = min(100, int(rating))
        
        # Build response data
        data = {
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "rating": rating,  # Add the user's rating to the response
                "last_5_ratings": last_5_ratings  # Include last 5 ratings
            },
            "progress": {
                "learning": learning_progress,
                "challenges": challenge_progress
            },
            "recent_activities": {
                "lessons": getattr(user, 'last_3_lessons', []),
                "submissions": getattr(user, 'last_3_submissions', [])
            }
        }
        
        return jsonify(data)
        
    except Exception as e:
        print(f"Dashboard error: {e}")  # Add logging to see the specific error
        return jsonify({"error": str(e)}), 500