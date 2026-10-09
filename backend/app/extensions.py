from typing import Optional
from pymongo import MongoClient
import mongomock
from .utils.logger import logger

class Database:
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_mock: bool = False

    def init_app(self, app):
        uri = app.config.get("MONGODB_URI", "mongodb://localhost:27017/hairdrama_tasks")
        db_name = app.config.get("MONGODB_DB_NAME", "hairdrama_tasks")
        testing = app.config.get("TESTING", False)

        if testing:
            logger.info("Initializing in-memory mock MongoDB for testing...")
            self.client = mongomock.MongoClient()
            self.db = self.client[db_name]
            self.is_mock = True
            return

        try:
            # Attempt to connect to real MongoDB with a 2-second server selection timeout
            real_client = MongoClient(uri, serverSelectionTimeoutMS=2000)
            # Test connection
            real_client.server_info()
            self.client = real_client
            self.db = self.client[db_name]
            self.is_mock = False
            logger.info(f"Connected successfully to MongoDB database: '{db_name}' at {uri.split('@')[-1]}")
        except Exception as exc:
            logger.warning(
                f"Could not connect to external MongoDB ({exc}). "
                f"Falling back to embedded in-memory database (mongomock) for seamless zero-setup execution."
            )
            self.client = mongomock.MongoClient()
            self.db = self.client[db_name]
            self.is_mock = True

        if not testing:
            try:
                task_count = self.db["tasks"].count_documents({})
                if task_count == 0:
                    import sys
                    from pathlib import Path
                    backend_dir = Path(__file__).resolve().parent.parent
                    if str(backend_dir) not in sys.path:
                        sys.path.insert(0, str(backend_dir))
                    from migrations.seed_data import seed_database
                    logger.info("Empty database detected. Automatically seeding initial users, tasks, and notifications...")
                    seed_database(target_db=self.db)
                    logger.info(f"Auto-seeding complete! Total tasks: {self.db['tasks'].count_documents({})}")
            except Exception as seed_err:
                logger.error(f"Failed to auto-seed database: {seed_err}")

    def get_collection(self, collection_name: str):
        if self.db is None:
            raise RuntimeError("Database has not been initialized. Call init_app first.")
        return self.db[collection_name]

db = Database()
