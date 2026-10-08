import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from ..extensions import db

class NotificationRepository:
    def __init__(self):
        pass

    @property
    def collection(self):
        return db.get_collection("notifications")

    def _serialize(self, doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not doc:
            return None
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": doc.get("user_id"),
            "task_id": doc.get("task_id"),
            "type": doc.get("type"),
            "title": doc.get("title"),
            "message": doc.get("message"),
            "is_read": bool(doc.get("is_read", False)),
            "created_at": doc.get("created_at"),
        }

    def find_by_id(self, notification_id: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"id": notification_id})
        return self._serialize(doc)

    def find_by_user(self, user_id: str, unread_only: bool = False, limit: int = 50) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {"user_id": user_id}
        if unread_only:
            query["is_read"] = False
        cursor = self.collection.find(query).sort("created_at", -1).limit(limit)
        return [self._serialize(d) for d in cursor]

    def count_unread(self, user_id: str) -> int:
        return self.collection.count_documents({"user_id": user_id, "is_read": False})

    def create(
        self,
        user_id: str,
        title: str,
        message: str,
        task_id: Optional[str] = None,
        notification_type: str = "TASK_NOTIFICATION"
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        notif_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "task_id": task_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "is_read": False,
            "created_at": now,
        }
        self.collection.insert_one(notif_data)
        return self._serialize(notif_data)

    def mark_as_read(self, notification_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        self.collection.update_one(
            {"id": notification_id, "user_id": user_id},
            {"$set": {"is_read": True}}
        )
        return self.find_by_id(notification_id)

    def mark_all_as_read(self, user_id: str) -> int:
        result = self.collection.update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True}}
        )
        return result.modified_count

notification_repository = NotificationRepository()
