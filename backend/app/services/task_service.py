from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List
from ..repositories.task_repository import task_repository
from ..repositories.user_repository import user_repository
from ..repositories.notification_repository import notification_repository
from ..repositories.activity_repository import activity_repository
from ..schemas.task_schema import TaskSchema
from ..utils.validators import validate_task_status_transition, validate_task_priority
from .email_service import email_service
from ..utils.logger import logger

class TaskService:
    def __init__(self):
        pass

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        return task_repository.find_by_id(task_id)

    def list_tasks(
        self,
        current_user_id: str,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assigned_to: Optional[str] = None,
        search: Optional[str] = None,
        view: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return task_repository.find_all(
            current_user_id=current_user_id,
            status=status,
            priority=priority,
            assigned_to=assigned_to,
            search=search,
            view=view
        )

    def get_stats(self, user_id: str) -> Dict[str, int]:
        return task_repository.get_stats_for_user(user_id)

    def get_task_activities(self, task_id: str) -> List[Dict[str, Any]]:
        return activity_repository.get_activities_for_task(task_id)

    def create_task(self, creator: Dict[str, Any], data: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        title = data.get("title", "").strip()
        if not title:
            return None, "Task title is required"

        description = data.get("description", "").strip()
        priority = data.get("priority", "MEDIUM").upper()
        if not validate_task_priority(priority):
            return None, f"Invalid priority '{priority}'"

        assigned_to = data.get("assigned_to", "").strip()
        if not assigned_to:
            return None, "Assignee is required"

        assignee = user_repository.find_by_id(assigned_to)
        if not assignee:
            return None, f"Assigned user with ID '{assigned_to}' not found"

        due_date = data.get("due_date")

        # 1. Create task document
        task_data = TaskSchema.prepare_new_task(
            title=title,
            description=description,
            created_by=creator["id"],
            assigned_to=assignee["id"],
            priority=priority,
            due_date=due_date
        )
        task = task_repository.create(task_data)

        # 2. Log activity
        activity_repository.log_activity(
            task_id=task["id"],
            user_id=creator["id"],
            action="CREATED_TASK",
            new_value=f"Created task '{title}' with priority {priority}"
        )

        # 3. Create in-app notification for assignee
        notification_repository.create(
            user_id=assignee["id"],
            task_id=task["id"],
            notification_type="TASK_ASSIGNED",
            title="New Task Assigned",
            message=f"{creator['name']} assigned you the task '{title}'"
        )

        # 4. Asynchronous email notification via Email Service (resilient per Section 17)
        try:
            email_service.send_task_assigned_email(
                recipient_email=assignee["email"],
                recipient_name=assignee["name"],
                task=task,
                creator_name=creator["name"]
            )
        except Exception as exc:
            logger.error(f"Non-blocking email dispatch failed during task creation: {exc}")

        return task, None

    def update_status(self, task_id: str, current_user: Dict[str, Any], new_status: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        task = task_repository.find_by_id(task_id)
        if not task:
            return None, "Task not found"

        new_status = new_status.upper()
        is_valid, err_msg = validate_task_status_transition(task["status"], new_status)
        if not is_valid:
            return None, err_msg

        old_status = task["status"]
        if old_status == new_status:
            return task, None

        now = datetime.now(timezone.utc).isoformat()
        updates = {"status": new_status}

        if new_status == "COMPLETED":
            updates["completed_at"] = now
        elif old_status == "COMPLETED" and new_status != "COMPLETED":
            updates["completed_at"] = None

        updated_task = task_repository.update(task_id, updates)

        # Log activity
        activity_repository.log_activity(
            task_id=task_id,
            user_id=current_user["id"],
            action="STATUS_CHANGED",
            old_value=old_status,
            new_value=new_status
        )

        # In-app notification & Email logic
        if new_status == "COMPLETED":
            # Notify creator
            creator_id = task["created_by"]
            if creator_id != current_user["id"]:
                notification_repository.create(
                    user_id=creator_id,
                    task_id=task_id,
                    notification_type="TASK_COMPLETED",
                    title="Task Completed",
                    message=f"{current_user['name']} completed the task '{task['title']}'"
                )
                creator = user_repository.find_by_id(creator_id)
                if creator:
                    try:
                        email_service.send_task_completed_email(
                            recipient_email=creator["email"],
                            recipient_name=creator["name"],
                            task=updated_task,
                            completed_by_name=current_user["name"],
                            completed_at=now
                        )
                    except Exception as exc:
                        logger.error(f"Non-blocking email dispatch failed during task completion: {exc}")
        else:
            # Notify the other party about status change
            other_user_id = task["assigned_to"] if current_user["id"] == task["created_by"] else task["created_by"]
            if other_user_id:
                notification_repository.create(
                    user_id=other_user_id,
                    task_id=task_id,
                    notification_type="TASK_STATUS_CHANGED",
                    title="Task Status Updated",
                    message=f"{current_user['name']} changed '{task['title']}' status to {new_status}"
                )

        return updated_task, None

    def assign_task(self, task_id: str, creator: Dict[str, Any], new_assignee_id: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        task = task_repository.find_by_id(task_id)
        if not task:
            return None, "Task not found"

        new_assignee = user_repository.find_by_id(new_assignee_id)
        if not new_assignee:
            return None, f"User '{new_assignee_id}' not found"

        old_assignee_id = task["assigned_to"]
        if old_assignee_id == new_assignee_id:
            return task, None

        updated_task = task_repository.update(task_id, {"assigned_to": new_assignee_id})

        activity_repository.log_activity(
            task_id=task_id,
            user_id=creator["id"],
            action="ASSIGNED_TASK",
            old_value=old_assignee_id,
            new_value=new_assignee_id
        )

        notification_repository.create(
            user_id=new_assignee["id"],
            task_id=task_id,
            notification_type="TASK_ASSIGNED",
            title="Task Assigned to You",
            message=f"{creator['name']} assigned you the task '{task['title']}'"
        )

        try:
            email_service.send_task_assigned_email(
                recipient_email=new_assignee["email"],
                recipient_name=new_assignee["name"],
                task=updated_task,
                creator_name=creator["name"]
            )
        except Exception as exc:
            logger.error(f"Non-blocking email dispatch failed during task reassignment: {exc}")

        return updated_task, None

    def update_task_details(self, task_id: str, creator: Dict[str, Any], data: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        task = task_repository.find_by_id(task_id)
        if not task:
            return None, "Task not found"

        updates: Dict[str, Any] = {}
        if "title" in data:
            title = data["title"].strip()
            if not title:
                return None, "Title cannot be empty"
            updates["title"] = title

        if "description" in data:
            updates["description"] = data["description"].strip()

        if "priority" in data:
            priority = data["priority"].upper()
            if not validate_task_priority(priority):
                return None, f"Invalid priority '{priority}'"
            updates["priority"] = priority

        if "due_date" in data:
            updates["due_date"] = data["due_date"]

        if not updates:
            return task, None

        updated_task = task_repository.update(task_id, updates)

        activity_repository.log_activity(
            task_id=task_id,
            user_id=creator["id"],
            action="UPDATED_TASK",
            new_value=", ".join(updates.keys())
        )

        return updated_task, None

    def delete_task(self, task_id: str) -> bool:
        return task_repository.delete(task_id)

task_service = TaskService()
