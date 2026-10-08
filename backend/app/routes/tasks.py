from flask import Blueprint, request, g
from ..services.task_service import task_service
from ..middleware.auth import login_required
from ..middleware.permissions import require_task_permission
from ..utils.responses import success_response, error_response

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/stats", methods=["GET"])
@login_required
def get_stats():
    stats = task_service.get_stats(g.current_user["id"])
    return success_response(stats)

@tasks_bp.route("", methods=["GET"])
@login_required
def list_tasks():
    status = request.args.get("status")
    priority = request.args.get("priority")
    assigned_to = request.args.get("assigned_to")
    search = request.args.get("search")
    view = request.args.get("view")

    tasks = task_service.list_tasks(
        current_user_id=g.current_user["id"],
        status=status,
        priority=priority,
        assigned_to=assigned_to,
        search=search,
        view=view
    )
    return success_response(tasks)

@tasks_bp.route("", methods=["POST"])
@login_required
def create_task():
    data = request.get_json(silent=True) or {}
    task, err = task_service.create_task(g.current_user, data)
    if err:
        return error_response(code="VALIDATION_ERROR", message=err, status_code=400)
    return success_response(task, message="Task created successfully", status_code=201)

@tasks_bp.route("/<string:id>", methods=["GET"])
@login_required
@require_task_permission("view")
def get_task(id: str):
    return success_response(g.task)

@tasks_bp.route("/<string:id>", methods=["PATCH"])
@login_required
@require_task_permission("edit")
def update_task(id: str):
    data = request.get_json(silent=True) or {}
    updated_task, err = task_service.update_task_details(id, g.current_user, data)
    if err:
        return error_response(code="VALIDATION_ERROR", message=err, status_code=400)
    return success_response(updated_task, message="Task updated successfully")

@tasks_bp.route("/<string:id>/status", methods=["PATCH"])
@login_required
@require_task_permission("change_status")
def update_status(id: str):
    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if not new_status:
        return error_response(code="MISSING_STATUS", message="New status is required", status_code=400)

    updated_task, err = task_service.update_status(id, g.current_user, new_status)
    if err:
        return error_response(code="INVALID_STATUS_TRANSITION", message=err, status_code=400)
    return success_response(updated_task, message="Task status updated successfully")

@tasks_bp.route("/<string:id>/assign", methods=["PATCH"])
@login_required
@require_task_permission("assign")
def assign_task(id: str):
    data = request.get_json(silent=True) or {}
    assigned_to = data.get("assigned_to")
    if not assigned_to:
        return error_response(code="MISSING_ASSIGNEE", message="Assigned user ID is required", status_code=400)

    updated_task, err = task_service.assign_task(id, g.current_user, assigned_to)
    if err:
        return error_response(code="ASSIGNMENT_ERROR", message=err, status_code=400)
    return success_response(updated_task, message="Task assigned successfully")

@tasks_bp.route("/<string:id>", methods=["DELETE"])
@login_required
@require_task_permission("delete")
def delete_task(id: str):
    task_service.delete_task(id)
    return success_response(message="Task deleted successfully")

@tasks_bp.route("/<string:id>/activity", methods=["GET"])
@login_required
@require_task_permission("view_activity")
def get_activity(id: str):
    activities = task_service.get_task_activities(id)
    return success_response(activities)
