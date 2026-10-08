from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import re
from ..extensions import db
from ..schemas.task_schema import TaskSchema
from .user_repository import user_repository

class TaskRepository:
    def __init__(self):
        pass

    @property
    def collection(self):
        return db.get_collection("tasks")

    def _populate_users(self, task_doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not task_doc:
            return None
        serialized = TaskSchema.serialize(task_doc)
        if serialized.get("created_by"):
            serialized["creator"] = user_repository.find_by_id(serialized["created_by"])
        if serialized.get("assigned_to"):
            serialized["assignee"] = user_repository.find_by_id(serialized["assigned_to"])
        return serialized

    def find_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        task_doc = self.collection.find_one({"id": task_id})
        return self._populate_users(task_doc)

    def find_all(
        self,
        current_user_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assigned_to: Optional[str] = None,
        search: Optional[str] = None,
        view: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {}

        if status:
            if status == "OVERDUE":
                now_iso = datetime.now(timezone.utc).isoformat()
                query["status"] = {"$ne": "COMPLETED"}
                query["due_date"] = {"$lt": now_iso, "$ne": None}
            else:
                query["status"] = status
        if priority:
            query["priority"] = priority
        if assigned_to:
            query["assigned_to"] = assigned_to

        if view == "created" and current_user_id:
            query["created_by"] = current_user_id
        elif view == "assigned" and current_user_id:
            query["assigned_to"] = current_user_id
        elif view in ("all", "all_system"):
            # Return all deliverables across team
            pass
        elif current_user_id:
            # By default, a user sees tasks they created or tasks assigned to them
            query["$or"] = [
                {"created_by": current_user_id},
                {"assigned_to": current_user_id}
            ]

        if search:
            regex = re.compile(re.escape(search), re.IGNORECASE)
            search_clause = [
                {"title": regex},
                {"description": regex}
            ]
            if "$or" in query:
                query["$and"] = [{"$or": query.pop("$or")}, {"$or": search_clause}]
            else:
                query["$or"] = search_clause

        cursor = self.collection.find(query).sort("created_at", -1).limit(limit)
        return [self._populate_users(doc) for doc in cursor]

    def create(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        self.collection.insert_one(task_data)
        return self.find_by_id(task_data["id"])

    def update(self, task_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        self.collection.update_one({"id": task_id}, {"$set": updates})
        return self.find_by_id(task_id)

    def delete(self, task_id: str) -> bool:
        result = self.collection.delete_one({"id": task_id})
        return result.deleted_count > 0

    def get_stats_for_user(self, user_id: str) -> Dict[str, int]:
        tasks = self.find_all(current_user_id=user_id, limit=1000)
        now_iso = datetime.now(timezone.utc).isoformat()
        
        total = len(tasks)
        todo = sum(1 for t in tasks if t["status"] == "TODO")
        in_progress = sum(1 for t in tasks if t["status"] == "IN_PROGRESS")
        completed = sum(1 for t in tasks if t["status"] == "COMPLETED")
        
        overdue = 0
        for t in tasks:
            due = t.get("due_date")
            if due and t["status"] != "COMPLETED" and due < now_iso:
                overdue += 1

        return {
            "total": total,
            "todo": todo,
            "in_progress": in_progress,
            "completed": completed,
            "overdue": overdue
        }

task_repository = TaskRepository()
