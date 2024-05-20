import logging

from flask import Blueprint, jsonify, request

from utils.speech_to_text import instance_speech_to_text

speech_to_text_bp = Blueprint("speech_to_text_bp", __name__)


@speech_to_text_bp.route('/speech_to_text', methods=['POST'])
def index():
    logger = logging.getLogger(__name__)
    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'})
    file = request.files['file']
    logger.info("Received audio")
    text = instance_speech_to_text(file)
    return text
