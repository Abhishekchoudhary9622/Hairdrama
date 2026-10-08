from functools import wraps
from flask import g
from ..repositories.task_repository import task_repository
from ..utils.responses import error_response

def require_task_permission(action: str):
    """
    Authorization Matrix (Section 11):
    Action         | Creator | Assignee | Other User
    View task      | ✅      | ✅       | ❌
    Edit task      | ✅      | ❌       | ❌
    Change status  | ✅      | ✅       | ❌
    Assign task    | ✅      | ❌       | ❌
    Delete task    | ✅      | ❌       | ❌
    View activity  | ✅      | ✅       | ❌
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            task_id = kwargs.get("id") or kwargs.get("task_id")
            if not task_id:
                return error_response(code="BAD_REQUEST", message="Task ID is required", status_code=400)

            task = task_repository.find_by_id(task_id)
            if not task:
                return error_response(code="TASK_NOT_FOUND", message="Task was not found", status_code=404)

            current_user = getattr(g, "current_user", None)
            if not current_user:
                return error_response(code="UNAUTHORIZED", message="Authentication required", status_code=401)

            user_id = current_user["id"]
            is_creator = task["created_by"] == user_id
            is_assignee = task["assigned_to"] == user_id

            if action in ("view", "view_activity"):
                if not (is_creator or is_assignee):
                    return error_response(code="FORBIDDEN", message="You do not have permission to view this task", status_code=403)

            elif action == "change_status":
                if not (is_creator or is_assignee):
                    return error_response(code="FORBIDDEN", message="Only the task creator or assignee can update task status", status_code=403)

            elif action in ("edit", "assign", "delete"):
                if not is_creator:
                    return error_response(code="FORBIDDEN", message=f"Only the task creator can {action} this task", status_code=403)

            g.task = task
            return f(*args, **kwargs)

        return decorated_function
    return decorator
