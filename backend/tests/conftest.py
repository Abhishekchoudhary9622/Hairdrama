import pytest
import mongomock
from app import create_app
from app.config.settings import TestingConfig
from app.extensions import db
from app.repositories.user_repository import user_repository
from app.services.auth_service import auth_service

@pytest.fixture(scope="session")
def app():
    # Force in-memory mock client for test isolation
    app = create_app(TestingConfig)
    return app

@pytest.fixture(autouse=True)
def clean_db(app):
    with app.app_context():
        # Clear collections between test runs
        for col_name in ["users", "tasks", "notifications", "task_activity"]:
            try:
                db.get_collection(col_name).delete_many({})
            except Exception:
                pass

        # Seed standard testing users
        user_a = user_repository.upsert_google_user(
            google_id="test-creator-1",
            email="abhishek@hairdrama.tech",
            name="Abhishek Verma"
        )
        user_b = user_repository.upsert_google_user(
            google_id="test-assignee-2",
            email="rahul@hairdrama.tech",
            name="Rahul Sharma"
        )
        user_c = user_repository.upsert_google_user(
            google_id="test-other-3",
            email="neha@hairdrama.tech",
            name="Neha Patel"
        )
    yield

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def creator_user(app):
    with app.app_context():
        return user_repository.find_by_email("abhishek@hairdrama.tech")

@pytest.fixture
def assignee_user(app):
    with app.app_context():
        return user_repository.find_by_email("rahul@hairdrama.tech")

@pytest.fixture
def other_user(app):
    with app.app_context():
        return user_repository.find_by_email("neha@hairdrama.tech")

@pytest.fixture
def creator_headers(app, creator_user):
    with app.app_context():
        token = auth_service.create_jwt_token(creator_user["id"], creator_user["email"])
        return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def assignee_headers(app, assignee_user):
    with app.app_context():
        token = auth_service.create_jwt_token(assignee_user["id"], assignee_user["email"])
        return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def other_headers(app, other_user):
    with app.app_context():
        token = auth_service.create_jwt_token(other_user["id"], other_user["email"])
        return {"Authorization": f"Bearer {token}"}
