from functools import wraps
from flask import request, g
from ..services.auth_service import auth_service
from ..repositories.user_repository import user_repository
from ..utils.responses import error_response

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = None

        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
        elif "token" in request.cookies:
            token = request.cookies.get("token")

        if not token:
            return error_response(
                code="UNAUTHORIZED",
                message="Authentication credentials were not provided or invalid.",
                status_code=401
            )

        payload = auth_service.verify_jwt_token(token)
        if not payload or not payload.get("sub"):
            return error_response(
                code="INVALID_TOKEN",
                message="Session has expired or token is invalid.",
                status_code=401
            )

        user_id = payload["sub"]
        user = user_repository.find_by_id(user_id)
        if not user:
            return error_response(
                code="USER_NOT_FOUND",
                message="Authenticated user record could not be found.",
                status_code=401
            )

        g.current_user = user
        return f(*args, **kwargs)

    return decorated_function

def optional_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = None
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
        
        g.current_user = None
        if token:
            payload = auth_service.verify_jwt_token(token)
            if payload and payload.get("sub"):
                g.current_user = user_repository.find_by_id(payload["sub"])
        return f(*args, **kwargs)
    return decorated_function
