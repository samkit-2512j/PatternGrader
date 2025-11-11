"""
Run this script to clean up any existing submissions with null submission_ids.
This will fix the duplicate key error by first dropping the problematic index,
updating documents, and then recreating the index properly.
"""
import uuid
import sys
from mongoengine import connect, disconnect
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import time

# First disconnect any existing connections
disconnect()

# Load environment variables from .env file
load_dotenv()

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://SE_Admin:8UOqGeYk8oHCtjNq@clusterx.iiqemsh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterX"
DB_NAME = "DesignDojo"

def clean_null_submission_ids():
    try:
        print("Connecting to MongoDB...")
        # Connect directly with pymongo for more control
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        submissions_collection = db["submissions"]
        
        print("Connected to MongoDB successfully!")
        
        # Step 1: Drop the problematic index if it exists
        print("Dropping the submission_id index...")
        try:
            submissions_collection.drop_index("submission_id_1")
            print("Index dropped successfully")
        except Exception as e:
            print(f"No index to drop or error dropping index: {e}")
        
        # Step 2: Find and update documents with null submission_id
        print("Finding documents with null submission_id...")
        null_filter = {"submission_id": {"$exists": False}}
        null_count = submissions_collection.count_documents(null_filter)
        print(f"Found {null_count} documents with null submission_id")
        
        empty_filter = {"submission_id": ""}
        empty_count = submissions_collection.count_documents(empty_filter)
        print(f"Found {empty_count} documents with empty submission_id")
        
        # Update null submission_ids
        if null_count > 0:
            print("Updating documents with null submission_id...")
            for doc in submissions_collection.find(null_filter):
                new_id = str(uuid.uuid4())
                submissions_collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"submission_id": new_id}}
                )
                print(f"Updated document {doc['_id']} with new submission_id: {new_id}")
        
        # Update empty submission_ids
        if empty_count > 0:
            print("Updating documents with empty submission_id...")
            for doc in submissions_collection.find(empty_filter):
                new_id = str(uuid.uuid4())
                submissions_collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"submission_id": new_id}}
                )
                print(f"Updated document {doc['_id']} with new submission_id: {new_id}")
        
        # Step 3: Create the index with sparse option
        print("Creating new unique index with sparse option...")
        submissions_collection.create_index("submission_id", unique=True, sparse=True)
        print("Index created successfully!")
        
        total_updated = null_count + empty_count
        print(f"Database cleanup completed successfully. Updated {total_updated} documents.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed")

if __name__ == "__main__":
    clean_null_submission_ids()
