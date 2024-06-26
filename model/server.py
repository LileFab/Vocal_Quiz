from flask import Flask
from flask_cors import CORS
from typing import List
import logging
from flasgger import Swagger


def register_blueprints(app: Flask, list_bp: List):
    for bp in list_bp:
        app.register_blueprint(bp)


def configure_logging(app: Flask, log_level: str):
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
    logger.info(f"Logger configured, level is {logger.getEffectiveLevel()}")
    return logger


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/speech_to_text": {"origins": "*"}})
    import secrets
    app.secret_key = secrets.token_hex(128)
    logger = configure_logging(app, "INFO")

    try:
        logger.info("Starting Blueprints registration...")
        from api.v1.speech_to_text_api import speech_to_text_bp
        from api.v1.hello_api import hello_world_bp
        list_bp = [speech_to_text_bp, hello_world_bp]
        register_blueprints(app, list_bp)
        logger.info("Successfully registered Blueprints.")
    except Exception as e:
        logger.critical(
            f"An error occurred: Unable to register Blueprints: {e}",
            exc_info=True
        )
    return app


flask_app = create_app()
swagger = Swagger(flask_app)

if __name__ == '__main__':
    flask_app.run(port=5000, host="0.0.0.0", debug=True)
