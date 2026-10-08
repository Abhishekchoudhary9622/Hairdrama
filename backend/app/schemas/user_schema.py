import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class UserSchema:
    @staticmethod
    def serialize(user_doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not user_doc:
            return None
        return {
            "id": str(user_doc.get("id") or user_doc.get("_id")),
            "google_id": user_doc.get("google_id"),
            "email": user_doc.get("email"),
            "name": user_doc.get("name"),
            "avatar_url": user_doc.get("avatar_url"),
            "created_at": user_doc.get("created_at"),
            "updated_at": user_doc.get("updated_at"),
        }

    @staticmethod
    def prepare_new_user(email: str, name: str, google_id: Optional[str] = None, avatar_url: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        return {
            "id": str(uuid.uuid4()),
            "google_id": google_id,
            "email": email.strip().lower(),
            "name": name.strip(),
            "avatar_url": avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}",
            "created_at": now,
            "updated_at": now,
        }
