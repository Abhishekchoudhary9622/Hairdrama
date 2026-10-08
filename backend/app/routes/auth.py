from flask import Blueprint, request, redirect, current_app, g
from ..services.auth_service import auth_service
from ..middleware.auth import login_required
from ..utils.responses import success_response, error_response
from ..utils.logger import logger

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/google", methods=["GET"])
def google_login():
    """Initiates Google OAuth flow by returning or redirecting to Google auth URL."""
    state = request.args.get("state", "login")
    auth_url = auth_service.get_google_auth_url(state=state)
    if request.args.get("redirect") == "true":
        return redirect(auth_url)
    return success_response({"auth_url": auth_url})

@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    """Handles Google OAuth callback code."""
    code = request.args.get("code")
    error = request.args.get("error")
    frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")

    if error:
        logger.error(f"Google OAuth error received: {error}")
        return redirect(f"{frontend_url}/login?error={error}")

    if not code:
        return error_response(code="MISSING_CODE", message="Missing authorization code", status_code=400)

    user_info, err = auth_service.exchange_google_code(code)
    if err or not user_info:
        logger.error(f"Failed to authenticate with Google: {err}")
        return redirect(f"{frontend_url}/login?error=auth_failed")

    auth_data = auth_service.authenticate_or_register_google_user(user_info)
    token = auth_data["token"]
    
    # Redirect back to frontend dashboard with token in URL parameter or cookie
    return redirect(f"{frontend_url}/dashboard?token={token}")

@auth_bp.route("/me", methods=["GET"])
@login_required
def get_current_user():
    """Returns currently authenticated user profile."""
    return success_response(g.current_user)

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logs out by acknowledging session termination."""
    return success_response(message="Logged out successfully")

@auth_bp.route("/dev-login", methods=["POST"])
def dev_login():
    """
    Developer login switcher to easily demo Account A (Abhishek) vs Account B (Rahul)
    as specified in Section 27 two-user testing flow.
    """
    data = request.get_json(silent=True) or {}
    email = data.get("email", "abhishek@hairdrama.tech")
    name = data.get("name")
    
    auth_data = auth_service.dev_login(email=email, name=name)
    return success_response(auth_data, message=f"Logged in as {auth_data['user']['name']}")
