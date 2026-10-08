from flask import Flask
from werkzeug.exceptions import HTTPException
from ..utils.responses import error_response
from ..utils.logger import logger

def register_error_handlers(app: Flask):
    @app.errorhandler(400)
    def bad_request(error):
        return error_response(
            code="BAD_REQUEST",
            message=getattr(error, "description", "Bad request"),
            status_code=400
        )

    @app.errorhandler(401)
    def unauthorized(error):
        return error_response(
            code="UNAUTHORIZED",
            message=getattr(error, "description", "Authentication required"),
            status_code=401
        )

    @app.errorhandler(403)
    def forbidden(error):
        return error_response(
            code="FORBIDDEN",
            message=getattr(error, "description", "Permission denied"),
            status_code=403
        )

    @app.errorhandler(404)
    def not_found(error):
        return error_response(
            code="NOT_FOUND",
            message=getattr(error, "description", "Resource not found"),
            status_code=404
        )

    @app.errorhandler(405)
    def method_not_allowed(error):
        return error_response(
            code="METHOD_NOT_ALLOWED",
            message="Method not allowed for this route",
            status_code=405
        )

    @app.errorhandler(Exception)
    def handle_unexpected_exception(error):
        if isinstance(error, HTTPException):
            return error_response(
                code=error.name.upper().replace(" ", "_"),
                message=error.description,
                status_code=error.code
            )
        logger.exception(f"Unhandled Exception: {str(error)}")
        return error_response(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred",
            status_code=500
        )
