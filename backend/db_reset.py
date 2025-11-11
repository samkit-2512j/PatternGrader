"""
WARNING: This script will drop all indexes on the submissions collection 
and recreate them. Only use if you're experiencing persistent index issues.
"""
import sys
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://SE_Admin:8UOqGeYk8oHCtjNq@clusterx.iiqemsh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterX"
DB_NAME = "DesignDojo"

def reset_indexes():
    try:
        print("Connecting to MongoDB...")
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        submissions_collection = db["submissions"]
        
        print("Connected to MongoDB successfully!")
        
        # Confirm before proceeding
        confirm = input("This will drop ALL indexes on the submissions collection. Type 'YES' to confirm: ")
        if confirm != "YES":
            print("Operation cancelled.")
            return
            
        # Drop all indexes
        print("Dropping all indexes from submissions collection...")
        submissions_collection.drop_indexes()
        print("All indexes dropped successfully")
        
        # Create the submission_id index with sparse option
        print("Creating new unique index with sparse option...")
        submissions_collection.create_index("submission_id", unique=True, sparse=True)
        print("Index created successfully!")
        
        print("Database index reset completed successfully.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed")

if __name__ == "__main__":
    reset_indexes()
