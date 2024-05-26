import logging

from flask_cors import cross_origin

from flask import Blueprint, jsonify, request

from utils.speech_to_text import instance_speech_to_text

speech_to_text_bp = Blueprint("speech_to_text_bp", __name__)


@speech_to_text_bp.route('/speech_to_text', methods=['POST'])
@cross_origin()
def index():
    """
    Speech to Text endpoint
    ---
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: file
        type: file
        required: true
        description: The WAV file to be converted to text
    responses:
      200:
        description: Text successfully extracted from audio
        schema:
          type: string
          example: "oui, non, un, deux, trois, quatre"
      400:
        description: No file sent or error processing the file
        schema:
          type: object
          properties:
            error:
              type: string
              example: "No file sent"
    """
    logger = logging.getLogger(__name__)
    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'})
    files = request.files['file']
    logger.info("Received audio")
    text = instance_speech_to_text(files)
    return text
