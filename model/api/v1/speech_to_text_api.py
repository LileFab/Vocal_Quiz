import logging

from flask_cors import cross_origin


from flask import Blueprint, jsonify, request

from utils.speech_to_text import instance_speech_to_text

speech_to_text_bp = Blueprint("speech_to_text_bp", __name__)


@speech_to_text_bp.route('/speech_to_text', methods=['POST'])
@cross_origin()
def index():
    logger = logging.getLogger(__name__)
    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'})
    files = request.files['file']
    logger.info("Received audio")
    text = instance_speech_to_text(files)
    return text
