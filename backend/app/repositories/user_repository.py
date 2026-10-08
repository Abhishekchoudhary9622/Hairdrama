from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import re
from ..extensions import db
from ..schemas.user_schema import UserSchema

class UserRepository:
    def __init__(self):
        self._collection = None

    @property
    def collection(self):
        return db.get_collection("users")

    def find_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        user_doc = self.collection.find_one({"id": user_id})
        return UserSchema.serialize(user_doc)

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user_doc = self.collection.find_one({"email": email.strip().lower()})
        return UserSchema.serialize(user_doc)

    def find_by_google_id(self, google_id: str) -> Optional[Dict[str, Any]]:
        user_doc = self.collection.find_one({"google_id": google_id})
        return UserSchema.serialize(user_doc)

    def create(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        self.collection.insert_one(user_data)
        return UserSchema.serialize(user_data)

    def update(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        self.collection.update_one({"id": user_id}, {"$set": updates})
        return self.find_by_id(user_id)

    def upsert_google_user(self, google_id: str, email: str, name: str, avatar_url: Optional[str] = None) -> Dict[str, Any]:
        existing = self.find_by_google_id(google_id) or self.find_by_email(email)
        now = datetime.now(timezone.utc).isoformat()
        if existing:
            updates = {
                "name": name,
                "google_id": google_id,
                "updated_at": now
            }
            if avatar_url:
                updates["avatar_url"] = avatar_url
            self.collection.update_one({"id": existing["id"]}, {"$set": updates})
            return self.find_by_id(existing["id"])
        
        new_user = UserSchema.prepare_new_user(
            email=email,
            name=name,
            google_id=google_id,
            avatar_url=avatar_url
        )
        return self.create(new_user)

    def search_users(self, query: str = "", limit: int = 20, exclude_id: Optional[str] = None) -> List[Dict[str, Any]]:
        filter_criteria: Dict[str, Any] = {}
        if query:
            regex = re.compile(re.escape(query), re.IGNORECASE)
            filter_criteria["$or"] = [
                {"name": regex},
                {"email": regex}
            ]
        if exclude_id:
            filter_criteria["id"] = {"$ne": exclude_id}
            
        cursor = self.collection.find(filter_criteria).limit(limit)
        return [UserSchema.serialize(doc) for doc in cursor]

    def get_all(self, limit: int = 50) -> List[Dict[str, Any]]:
        cursor = self.collection.find().limit(limit)
        return [UserSchema.serialize(doc) for doc in cursor]

user_repository = UserRepository()
