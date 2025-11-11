from flask import Blueprint, request, jsonify
from mongoengine import DoesNotExist
from flask_jwt_extended import create_access_token
from models.user import User
from werkzeug.security import generate_password_hash
import pymongo.errors

signup_bp = Blueprint('signup', __name__)

@signup_bp.route('/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password or not username:
        return jsonify({"error": "Missing email, password, or username"}), 400
    
    try:
        # Check if the user already exists
        if User.objects(email=email).first():
            return jsonify({"success": False, "message": "Email already registered"}), 409
        
        if User.objects(username=username).first():
            return jsonify({"success": False, "message": "Username already taken"}), 409

        # Create new user
        user = User(
            username=username,
            password=generate_password_hash(password),
            email=email,
            rating=0.0,
            last_5_ratings=[],
            last_3_lessons=[],
            completed_lesson_count=0,
            last_3_submissions=[]
        )
        user.save()
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "success": True,
            "message": "User created successfully",
            "token": access_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "last_3_lessons": user.last_3_lessons,
                "completed_lesson_count": user.completed_lesson_count,
                "rating": user.rating,
                "last_3_submissions": user.last_3_submissions
            }
        })
    except pymongo.errors.ServerSelectionTimeoutError as e:
        return jsonify({"error": "Database connection error. Please try again later."}), 503
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"error": str(e)}), 500
