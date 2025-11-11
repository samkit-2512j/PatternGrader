from mongoengine import Document, StringField, IntField, ReferenceField, DictField
from .user import User
import uuid

class Submission(Document):
    meta = {
        'collection': 'submissions',
        'indexes': [
            {'fields': ['submission_id'], 'unique': True, 'sparse': True}
        ],
        'auto_create_index': False  # Disable automatic index creation
    }

    user_id = ReferenceField(User, required=True)
    question_id = StringField(required=True)
    username = StringField(required=True)
    score = IntField(required=True)
    llm_response = StringField(required=True, max_length=16777216)  # Set a max length (MongoDB limit is 16MB)
    # Add default lambda function to ensure submission_id is never null
    submission_id = StringField(required=True, unique=True, default=lambda: str(uuid.uuid4()))
    evaluation_data = DictField(default={})
    # New field to store the optimal solution
    optimal_solution = StringField(max_length=16777216, default="")