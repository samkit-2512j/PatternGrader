from mongoengine import Document, StringField, ListField, FloatField, IntField

class User(Document):
    meta = {'collection': 'user'}

    username = StringField(required=True, unique=True, max_length=50)
    password = StringField(required=True, max_length=255)
    email = StringField(required=False, unique=True, max_length=100)
    rating = FloatField(required=False, default=0)
    last_5_ratings = ListField(FloatField(), default=[])
    last_3_lessons = ListField(StringField(), default=[])
    completed_lesson_count = IntField(default=0)
    last_3_submissions = ListField(StringField(), default=[])
    completed_lessons = ListField(StringField(), default=[])
    completed_challenges = ListField(StringField(), default=[])  # New field for storing completed challenge IDs
