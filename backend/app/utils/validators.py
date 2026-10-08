import re
from typing import Tuple

VALID_STATUSES = {"TODO", "IN_PROGRESS", "COMPLETED"}
VALID_PRIORITIES = {"LOW", "MEDIUM", "HIGH", "URGENT"}

# Allowed state machine transitions: from_status -> set of allowed next statuses
ALLOWED_TRANSITIONS = {
    "TODO": {"IN_PROGRESS", "COMPLETED"},
    "IN_PROGRESS": {"TODO", "COMPLETED"},
    "COMPLETED": {"IN_PROGRESS"},  # Reopening completed task
}

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def is_valid_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def validate_task_status_transition(current_status: str, new_status: str) -> Tuple[bool, str]:
    if new_status not in VALID_STATUSES:
        return False, f"Invalid status '{new_status}'. Allowed values: {', '.join(VALID_STATUSES)}"
    if current_status == new_status:
        return True, ""
    allowed = ALLOWED_TRANSITIONS.get(current_status, set())
    if new_status not in allowed:
        return False, f"Cannot transition task status from '{current_status}' to '{new_status}'."
    return True, ""

def validate_task_priority(priority: str) -> bool:
    return priority in VALID_PRIORITIES
