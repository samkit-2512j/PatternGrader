from flask import request, jsonify
from functools import wraps
from backend.models.user import User
from mongoengine.errors import DoesNotExist

def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        email = request.headers.get('X-User-Email')
        if not email:
            return jsonify({"error": "Authentication required"}), 401

        try:
            user = User.objects.get(email=email)
            request.user = user
        except DoesNotExist:
            return jsonify({"error": "Invalid user"}), 401

        return f(*args, **kwargs)
    return decorated_function