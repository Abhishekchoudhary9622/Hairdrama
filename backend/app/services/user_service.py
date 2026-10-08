from typing import Optional, List, Dict, Any
from ..repositories.user_repository import user_repository

class UserService:
    def __init__(self):
        pass

    def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return user_repository.find_by_id(user_id)

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return user_repository.find_by_email(email)

    def list_users(self, limit: int = 50) -> List[Dict[str, Any]]:
        return user_repository.get_all(limit=limit)

    def search_users(self, query: str = "", limit: int = 20, exclude_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return user_repository.search_users(query=query, limit=limit, exclude_id=exclude_id)

    def update_profile(self, user_id: str, name: Optional[str] = None, avatar_url: Optional[str] = None) -> Optional[Dict[str, Any]]:
        updates = {}
        if name:
            updates["name"] = name.strip()
        if avatar_url:
            updates["avatar_url"] = avatar_url.strip()
        if not updates:
            return self.get_by_id(user_id)
        return user_repository.update(user_id, updates)

user_service = UserService()
