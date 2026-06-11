import os
from pymongo import MongoClient, TEXT
from core.config import MONGODB_URI

def seed_database():
    print(f"Connecting to MongoDB at: {MONGODB_URI}")
    client = MongoClient(MONGODB_URI)
    db = client.society_simulator
    collection = db.trends

    # Clear existing data
    collection.delete_many({})
    
    # Create text index for search
    collection.create_index([("hook", TEXT), ("content", TEXT)])

    # Insert mock viral data
    mock_data = [
        {
            "hook": "Did you know...",
            "content": "Did you know that most millionaires read 2 books a week?",
            "virality_factor": "High curiosity and aspiration.",
            "engagement_rate": 8.5
        },
        {
            "hook": "Unpopular opinion",
            "content": "Unpopular opinion: College is a scam in 2026.",
            "virality_factor": "Polarizing topic driving heavy comments.",
            "engagement_rate": 12.1
        },
        {
            "hook": "Storytime...",
            "content": "Storytime: How I lost $10,000 in one day trading crypto.",
            "virality_factor": "Narrative arc and schadenfreude.",
            "engagement_rate": 9.3
        },
        {
            "hook": "Life hack",
            "content": "This one life hack saves me 5 hours a week...",
            "virality_factor": "Actionable utility.",
            "engagement_rate": 7.8
        },
        {
            "hook": "Controversial take",
            "content": "Remote work is destroying company culture.",
            "virality_factor": "High controversy leading to debate.",
            "engagement_rate": 15.0
        }
    ]

    collection.insert_many(mock_data)
    print(f"Successfully seeded database with {len(mock_data)} viral trends!")

if __name__ == "__main__":
    seed_database()
