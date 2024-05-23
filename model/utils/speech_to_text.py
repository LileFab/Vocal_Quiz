import requests
import torch
import logging
from utils.lstm import LSTM
from utils.preprocess import (
    spectrogram_to_tensor_save,
    audio_to_mel_spectrogram_db,
    normalize
)


def download_model(model_url):
    try:
        response = requests.get(model_url)
        if response.status_code == 200:
            logger.info("Download the model: start")
            with open("model.pth", "wb") as file:
                file.write(response.content)
            logger.info("Download the model: end")
    except Exception as e:
        logger.info(f"An error occured: {e}")


def load_model():
    num_layers = 4
    hidden_size = 50
    num_classes = 6
    dropout = 0.25
    sequence_length = 128
    input_size = 465
    model = LSTM(input_size, hidden_size, num_layers, num_classes,
                 sequence_length, dropout)
    model.load_state_dict(torch.load("model.pth",
                                     map_location=torch.device('cpu')))
    model.eval()
    return model


def instance_speech_to_text(file):
    mel_spectrogram_db = audio_to_mel_spectrogram_db(file)
    spectrogram_to_tensor_save([mel_spectrogram_db], 'mel_spec_wav.pt')
    input_tensor = torch.load('mel_spec_wav.pt')
    input_tensor = normalize(input_tensor)
    lstm = load_model()
    with torch.no_grad():
        output = lstm(input_tensor)
    predicted_class_index = torch.argmax(output).item()
    sentence = {0: 'oui', 1: 'non', 2: 'un', 3: 'deux', 4: 'trois',
                5: 'quatre'}
    predicted_class = sentence[predicted_class_index]
    return predicted_class


logger = logging.getLogger(__name__)
model_url = "https://share.andrea-joly.fr/api/shares/quiz-in/files/5d8ac08f-82ac-4b49-83be-1df749affccd"
download_model(model_url=model_url)
