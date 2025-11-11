from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
from dotenv import load_dotenv
from mongoengine import connect, disconnect

# Import routes
from routes.signin import auth_bp
from routes.signup import signup_bp
from routes.profile import profile_bp
from routes.password import password_bp
from routes.dashboard import dashboard_bp
from routes.learning import learning_bp
from routes.competitive import competitive_bp
from routes.submissions import submission_bp

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["JWT_SECRET_KEY"] = "your-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

try:
    disconnect()
    
    connect(
        db="DesignDojo",
        host="mongodb+srv://SE_Admin:8UOqGeYk8oHCtjNq@clusterx.iiqemsh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterX",
        alias="default"
    )
    print("MongoDB connection established successfully!")
    
    # Safely set up the submission index if needed
    from models.submission import Submission
    from pymongo.errors import OperationFailure
    
    # Create submission indexes manually to avoid conflicts
    try:
        # First check if the index exists, then try to modify it if needed
        collection = Submission._get_collection()
        existing_indexes = collection.index_information()
        
        # Only create the index if it doesn't exist
        if 'submission_id_1' not in existing_indexes:
            print("Creating submission_id index...")
            collection.create_index('submission_id', unique=True, sparse=True)
            print("Index created successfully")
        else:
            print("Submission index already exists, skipping creation")
            
    except OperationFailure as e:
        print(f"Warning: Index operation issue: {str(e)}")
    except Exception as e:
        print(f"Warning: Error setting up indexes: {str(e)}")
        
except Exception as e:
    print(f"Error initializing MongoDB connection: {e}")

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(signup_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(password_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(learning_bp)
app.register_blueprint(competitive_bp)
app.register_blueprint(submission_bp)

@app.route('/')
def home():
    return jsonify({"message": "API is running. Please use /signin for authentication."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)