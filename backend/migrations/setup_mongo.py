import os
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient, ASCENDING, DESCENDING

def setup_mongodb(uri=None, db_name=None):
    uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/hairdrama_tasks")
    db_name = db_name or os.getenv("MONGODB_DB_NAME", "hairdrama_tasks")
    
    print(f"Connecting to MongoDB at: {uri} (Database: {db_name})...")
    client = MongoClient(uri, serverSelectionTimeoutMS=3000)
    db = client[db_name]
    
    # 1. Users Collection
    print("Setting up 'users' collection and indexes...")
    users_col = db["users"]
    users_col.create_index([("email", ASCENDING)], unique=True)
    users_col.create_index([("google_id", ASCENDING)], unique=True, sparse=True)
    
    # 2. Tasks Collection
    print("Setting up 'tasks' collection and indexes...")
    tasks_col = db["tasks"]
    tasks_col.create_index([("created_by", ASCENDING)])
    tasks_col.create_index([("assigned_to", ASCENDING)])
    tasks_col.create_index([("status", ASCENDING)])
    tasks_col.create_index([("priority", ASCENDING)])
    tasks_col.create_index([("due_date", ASCENDING)])
    tasks_col.create_index([("created_at", DESCENDING)])
    
    # 3. Notifications Collection
    print("Setting up 'notifications' collection and indexes...")
    notifs_col = db["notifications"]
    notifs_col.create_index([("user_id", ASCENDING), ("is_read", ASCENDING)])
    notifs_col.create_index([("created_at", DESCENDING)])
    
    # 4. Task Activity Collection
    print("Setting up 'task_activity' collection and indexes...")
    activity_col = db["task_activity"]
    activity_col.create_index([("task_id", ASCENDING), ("created_at", DESCENDING)])
    activity_col.create_index([("user_id", ASCENDING)])

    # Optional: Seed initial demo users for Section 27 Two-User testing
    seed_demo_users(users_col)
    
    print("MongoDB setup completed successfully!")

def seed_demo_users(users_col):
    now = datetime.now(timezone.utc).isoformat()
    demo_users = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "google_id": "google-demo-abhishek-101",
            "email": "abhishek@hairdrama.tech",
            "name": "Abhishek Verma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek",
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "google_id": "google-demo-rahul-102",
            "email": "rahul@hairdrama.tech",
            "name": "Rahul Sharma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
            "created_at": now,
            "updated_at": now,
        }
    ]
    for u in demo_users:
        users_col.update_one({"email": u["email"]}, {"$setOnInsert": u}, upsert=True)
    print("Demo seed users (Abhishek & Rahul) verified/inserted.")

if __name__ == "__main__":
    setup_mongodb()
