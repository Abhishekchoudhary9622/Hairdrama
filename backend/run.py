import os
from app import create_app
from app.utils.logger import logger

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    logger.info(f"Starting Hairdrama Task Manager Backend API on port {port} (debug={debug})")
    app.run(host="0.0.0.0", port=port, debug=debug)
