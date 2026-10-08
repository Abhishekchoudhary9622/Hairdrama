from flask import Blueprint, request, g
from ..repositories.notification_repository import notification_repository
from ..middleware.auth import login_required
from ..utils.responses import success_response, error_response

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("", methods=["GET"])
@login_required
def list_notifications():
    unread_only = request.args.get("unread_only", "false").lower() == "true"
    limit_raw = request.args.get("limit", 50)
    try:
        limit = min(max(int(limit_raw), 1), 100)
    except (ValueError, TypeError):
        limit = 50
    notifs = notification_repository.find_by_user(
        user_id=g.current_user["id"],
        unread_only=unread_only,
        limit=limit
    )
    unread_count = notification_repository.count_unread(g.current_user["id"])
    return success_response({
        "notifications": notifs,
        "unread_count": unread_count
    })

@notifications_bp.route("/<string:id>/read", methods=["PATCH"])
@login_required
def mark_read(id: str):
    updated = notification_repository.mark_as_read(id, g.current_user["id"])
    if not updated:
        return error_response(code="NOT_FOUND", message="Notification not found", status_code=404)
    return success_response(updated, message="Notification marked as read")

@notifications_bp.route("/read-all", methods=["PATCH"])
@login_required
def mark_all_read():
    count = notification_repository.mark_all_as_read(g.current_user["id"])
    return success_response({"modified_count": count}, message=f"Marked {count} notifications as read")
