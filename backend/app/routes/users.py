from flask import Blueprint, request, g
from ..services.user_service import user_service
from ..middleware.auth import login_required
from ..utils.responses import success_response, error_response

users_bp = Blueprint("users", __name__)

@users_bp.route("/me", methods=["GET"])
@login_required
def get_profile():
    return success_response(g.current_user)

@users_bp.route("/me", methods=["PATCH"])
@login_required
def update_profile():
    data = request.get_json(silent=True) or {}
    updated = user_service.update_profile(
        user_id=g.current_user["id"],
        name=data.get("name"),
        avatar_url=data.get("avatar_url")
    )
    return success_response(updated, message="Profile updated successfully")

@users_bp.route("", methods=["GET"])
@login_required
def list_users():
    users = user_service.list_users()
    return success_response(users)

@users_bp.route("/search", methods=["GET"])
@login_required
def search_users():
    query = request.args.get("q", "").strip()
    users = user_service.search_users(
        query=query,
        limit=20,
        exclude_id=g.current_user["id"]
    )
    return success_response(users)
