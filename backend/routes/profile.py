from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from mongoengine.errors import DoesNotExist

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        user_id = data.get('id') or current_user_id
        
        if str(user_id) != current_user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        if 'email' in data and data['email']:
            user = User.objects.get(email=data['email'])
        else:
            user = User.objects.get(id=user_id)

        if 'username' in data and data['username']:
            user.username = data['username']

        if 'email' in data and data['email']:
            existing_user = User.objects(email=data['email']).first()
            if existing_user and str(existing_user.id) != str(user.id):
                return jsonify({"error": "Email already in use"}), 400
            user.email = data['email']

        if 'password' in data and data['password']:
            user.password = generate_password_hash(data['password'])
            
        if 'last_lesson' in data and data['last_lesson']:
            if not hasattr(user, 'last_3_lessons') or user.last_3_lessons is None:
                user.last_3_lessons = []
                
            if isinstance(user.last_3_lessons, list):
                new_lessons = [data['last_lesson']]
                for lesson in user.last_3_lessons:
                    if lesson != data['last_lesson'] and len(new_lessons) < 3:
                        new_lessons.append(lesson)
                user.last_3_lessons = new_lessons
            else:
                user.last_3_lessons = [data['last_lesson']]

        user.save()

        return jsonify({
            "success": True, 
            "message": "Profile updated successfully",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "last_3_lessons": getattr(user, 'last_3_lessons', []),
                "completed_lesson_count": getattr(user, 'completed_lesson_count', 0),
                "rating": getattr(user, 'rating', 0),
                "last_5_ratings": getattr(user, 'last_5_ratings', []),
                "last_3_submissions": getattr(user, 'last_3_submissions', [])
            }
        })
    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Profile update error: {e}")
        return jsonify({"error": str(e)}), 500