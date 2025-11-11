from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from models.user import User
from mongoengine.errors import DoesNotExist

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signin', methods=['POST'])
def signin():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    try:
        user = User.objects.get(email=email)
        
        if not check_password_hash(user.password, password):
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": access_token,
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
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.objects.get(id=user_id)
        return jsonify({
            "success": True,
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
        return jsonify({"error": str(e)}), 500
