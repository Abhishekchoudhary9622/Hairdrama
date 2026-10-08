import datetime
from datetime import timezone
from typing import Optional, Dict, Any, Tuple
import jwt
import requests
from flask import current_app
from ..repositories.user_repository import user_repository
from ..utils.logger import logger

GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo"

class AuthService:
    def __init__(self):
        pass

    def get_jwt_secret(self) -> str:
        return current_app.config.get("JWT_SECRET", "default-jwt-secret-key-1234")

    def create_jwt_token(self, user_id: str, email: str) -> str:
        secret = self.get_jwt_secret()
        exp_hours = current_app.config.get("JWT_EXPIRATION_HOURS", 72)
        payload = {
            "sub": user_id,
            "email": email,
            "iat": datetime.datetime.now(timezone.utc),
            "exp": datetime.datetime.now(timezone.utc) + datetime.timedelta(hours=exp_hours),
        }
        token = jwt.encode(payload, secret, algorithm="HS256")
        return token

    def verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            secret = self.get_jwt_secret()
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT Token has expired")
            return None
        except jwt.InvalidTokenError as exc:
            logger.warning(f"Invalid JWT Token: {exc}")
            return None

    def get_google_auth_url(self, state: str = "state") -> str:
        client_id = current_app.config.get("GOOGLE_CLIENT_ID", "")
        redirect_uri = current_app.config.get("GOOGLE_REDIRECT_URI", "")
        
        scope = "openid email profile https://www.googleapis.com/auth/gmail.send"
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scope,
            "access_type": "offline",
            "prompt": "consent",
            "state": state,
        }
        query_string = "&".join(f"{k}={requests.utils.quote(v)}" for k, v in params.items())
        return f"{GOOGLE_AUTH_ENDPOINT}?{query_string}"

    def exchange_google_code(self, code: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        client_id = current_app.config.get("GOOGLE_CLIENT_ID", "")
        client_secret = current_app.config.get("GOOGLE_CLIENT_SECRET", "")
        redirect_uri = current_app.config.get("GOOGLE_REDIRECT_URI", "")

        token_data = {
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        try:
            token_resp = requests.post(GOOGLE_TOKEN_ENDPOINT, data=token_data, timeout=10)
            if not token_resp.ok:
                return None, f"Google token exchange failed: {token_resp.text}"
            
            token_json = token_resp.json()
            access_token = token_json.get("access_token")
            if not access_token:
                return None, "Google did not return an access token"

            headers = {"Authorization": f"Bearer {access_token}"}
            userinfo_resp = requests.get(GOOGLE_USERINFO_ENDPOINT, headers=headers, timeout=10)
            if not userinfo_resp.ok:
                return None, f"Google userinfo failed: {userinfo_resp.text}"
            
            user_info = userinfo_resp.json()
            return user_info, None
        except Exception as exc:
            logger.exception("Error communicating with Google OAuth endpoints")
            return None, str(exc)

    def authenticate_or_register_google_user(self, google_user_info: Dict[str, Any]) -> Dict[str, Any]:
        google_id = google_user_info.get("sub")
        email = google_user_info.get("email")
        name = google_user_info.get("name") or email.split("@")[0]
        avatar_url = google_user_info.get("picture")

        user = user_repository.upsert_google_user(
            google_id=google_id,
            email=email,
            name=name,
            avatar_url=avatar_url
        )
        token = self.create_jwt_token(user["id"], user["email"])
        return {
            "user": user,
            "token": token
        }

    def dev_login(self, email: str, name: Optional[str] = None) -> Dict[str, Any]:
        """Development helper for fast two-user testing (Abhishek & Rahul)."""
        user = user_repository.find_by_email(email)
        if not user:
            user = user_repository.upsert_google_user(
                google_id=f"dev-mock-{email}",
                email=email,
                name=name or email.split("@")[0].capitalize(),
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
            )
        token = self.create_jwt_token(user["id"], user["email"])
        return {
            "user": user,
            "token": token
        }

auth_service = AuthService()
