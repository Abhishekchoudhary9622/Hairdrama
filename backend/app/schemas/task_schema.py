import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class TaskSchema:
    @staticmethod
    def serialize(task_doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not task_doc:
            return None
        return {
            "id": str(task_doc.get("id") or task_doc.get("_id")),
            "title": task_doc.get("title"),
            "description": task_doc.get("description", ""),
            "status": task_doc.get("status", "TODO"),
            "priority": task_doc.get("priority", "MEDIUM"),
            "created_by": task_doc.get("created_by"),
            "creator": task_doc.get("creator"),
            "assigned_to": task_doc.get("assigned_to"),
            "assignee": task_doc.get("assignee"),
            "due_date": task_doc.get("due_date"),
            "created_at": task_doc.get("created_at"),
            "updated_at": task_doc.get("updated_at"),
            "completed_at": task_doc.get("completed_at"),
        }

    @staticmethod
    def prepare_new_task(
        title: str,
        description: str,
        created_by: str,
        assigned_to: str,
        priority: str = "MEDIUM",
        due_date: Optional[str] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        return {
            "id": str(uuid.uuid4()),
            "title": title.strip(),
            "description": description.strip() if description else "",
            "status": "TODO",
            "priority": priority,
            "created_by": created_by,
            "assigned_to": assigned_to,
            "due_date": due_date,
            "created_at": now,
            "updated_at": now,
            "completed_at": None,
        }
