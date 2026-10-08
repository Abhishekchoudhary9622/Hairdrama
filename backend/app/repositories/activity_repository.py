import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from ..extensions import db
from .user_repository import user_repository

class ActivityRepository:
    def __init__(self):
        pass

    @property
    def collection(self):
        return db.get_collection("task_activity")

    def _serialize(self, doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not doc:
            return None
        serialized = {
            "id": str(doc.get("id") or doc.get("_id")),
            "task_id": doc.get("task_id"),
            "user_id": doc.get("user_id"),
            "action": doc.get("action"),
            "old_value": doc.get("old_value"),
            "new_value": doc.get("new_value"),
            "created_at": doc.get("created_at"),
        }
        if serialized.get("user_id"):
            serialized["user"] = user_repository.find_by_id(serialized["user_id"])
        return serialized

    def log_activity(
        self,
        task_id: str,
        user_id: str,
        action: str,
        old_value: Optional[str] = None,
        new_value: Optional[str] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        record = {
            "id": str(uuid.uuid4()),
            "task_id": task_id,
            "user_id": user_id,
            "action": action,
            "old_value": old_value,
            "new_value": new_value,
            "created_at": now,
        }
        self.collection.insert_one(record)
        return self._serialize(record)

    def get_activities_for_task(self, task_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"task_id": task_id}).sort("created_at", -1).limit(limit)
        return [self._serialize(d) for d in cursor]

activity_repository = ActivityRepository()
