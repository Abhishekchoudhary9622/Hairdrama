from flask import Flask, jsonify
from flask_cors import CORS
from .config.settings import get_config
from .extensions import db
from .middleware.error_handler import register_error_handlers
from .routes import auth_bp, users_bp, tasks_bp, notifications_bp

def create_app(config_class=None):
    app = Flask(__name__)
    
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    # Enable CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    )

    # Initialize database
    db.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "hairdrama-task-manager",
            "database_mock": db.is_mock,
            "tasks_count": db.db["tasks"].count_documents({}) if db.db is not None else 0
        }), 200

    @app.route("/api/seed", methods=["GET", "POST"])
    def seed_data_endpoint():
        try:
            import sys
            from pathlib import Path
            backend_dir = Path(__file__).resolve().parent.parent
            if str(backend_dir) not in sys.path:
                sys.path.insert(0, str(backend_dir))
            from migrations.seed_data import seed_database
            seed_database(target_db=db.db)
            return jsonify({
                "success": True,
                "message": "Database successfully seeded with realistic Hairdrama Tech data!",
                "total_tasks": db.db["tasks"].count_documents({}),
                "total_users": db.db["users"].count_documents({})
            }), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    return app
