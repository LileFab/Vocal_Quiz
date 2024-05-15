import logging

from flask import Blueprint

hello_world_bp = Blueprint("hello_world_bp", __name__)

@hello_world_bp.route('/', methods=['GET'])
def index():
    logger = logging.getLogger(__name__)
    logger.info("Hello from API")
    return "Hello World !"
