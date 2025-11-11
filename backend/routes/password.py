from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from mongoengine.errors import DoesNotExist

password_bp = Blueprint('password', __name__)

@password_bp.route('/password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = User.objects.get(email=email)
        # Logic to send a password reset email (e.g., with a token) goes here
        return jsonify({"success": True, "message": "Password reset email sent"})
    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@password_bp.route('/password/change', methods=['PUT'])
@jwt_required()
def change_password():
    data = request.get_json()
    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not user_id or not current_password or not new_password:
        return jsonify({"error": "User ID, current password, and new password are required"}), 400

    # Verify JWT token matches the user
    current_user_id = get_jwt_identity()
    if str(user_id) != current_user_id:
        return jsonify({"error": "Unauthorized access"}), 403
        
    try:
        user = User.objects.get(id=user_id)
        
        # Verify current password
        if not check_password_hash(user.password, current_password):
            return jsonify({"error": "Current password is incorrect"}), 401
            
        user.password = generate_password_hash(new_password)
        user.save()

        return jsonify({"success": True, "message": "Password changed successfully"})
    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500