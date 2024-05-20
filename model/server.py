from flask import Flask
from typing import List
import logging
from traceback import format_exc


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
    except:
        print("error")
        logger.critical("Unable to register Blueprints.", exc_info=format_exc())
    return app


flask_app = create_app()

if __name__ == '__main__':
    flask_app.run(port=5000, host="0.0.0.0", debug=True)