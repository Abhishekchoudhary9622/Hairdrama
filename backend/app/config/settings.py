import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "hairdrama-dev-secret-key-390481023")
    JWT_SECRET = os.getenv("JWT_SECRET", "hairdrama-jwt-secret-key-298374921")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "72"))
    
    # MongoDB
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/hairdrama_tasks")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "hairdrama_tasks")
    
    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback")
    
    # Gmail API
    GMAIL_CLIENT_ID = os.getenv("GMAIL_CLIENT_ID", "")
    GMAIL_CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET", "")
    GMAIL_REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN", "")
    GMAIL_SENDER_EMAIL = os.getenv("GMAIL_SENDER_EMAIL", "noreply@hairdrama.tech")
    
    # CORS & URLs
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    MONGODB_DB_NAME = "hairdrama_tasks_test"

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}

def get_config():
    env = os.getenv("FLASK_ENV", "development")
    return config_by_name.get(env, DevelopmentConfig)
