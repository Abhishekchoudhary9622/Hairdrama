from typing import Any, Optional
from flask import jsonify, Response

def success_response(data: Any = None, message: Optional[str] = None, status_code: int = 200) -> Response:
    payload = {"success": True}
    if data is not None:
        payload["data"] = data
    if message:
        payload["message"] = message
    return jsonify(payload), status_code

def error_response(code: str, message: str, status_code: int = 400, details: Any = None) -> Response:
    payload = {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
    if details is not None:
        payload["error"]["details"] = details
    return jsonify(payload), status_code
