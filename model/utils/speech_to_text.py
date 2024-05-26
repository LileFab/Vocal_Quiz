import requests
import torch
import logging
import torchaudio
from utils.lstm import LSTM
from utils.preprocess import (
    waveform_to_mel_spectrogram_db,
    normalize,
    truncate_voice
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
    hidden_size = 60
    num_classes = 6
    dropout = 0.30
    sequence_length = 128
    input_size = 94
    model = LSTM(input_size, hidden_size, num_layers, num_classes,
                 sequence_length, dropout)
    model.load_state_dict(torch.load("model.pth",
                                     map_location=torch.device('cpu')))
    model.eval()
    return model


def instance_speech_to_text(file):
    waveform, _ = torchaudio.load(file)
    waveform = truncate_voice(waveform, target_sample_number=48000)
    mel_spectrograms_wav = waveform_to_mel_spectrogram_db(waveform, n_mels=128, n_fft=512, hop_length=512)
    input_tensor = normalize(mel_spectrograms_wav)
    input_tensor = input_tensor.unsqueeze(0)
    lstm = load_model()
    with torch.no_grad():
        output = lstm(input_tensor)
    predicted_class_index = torch.argmax(output, axis=1).item()
    sentence = {0: 'oui', 1: 'non', 2: 'un', 3: 'deux', 4: 'trois',
                5: 'quatre'}
    predicted_class = sentence[predicted_class_index]
    logger.info(f"Predicted class: {predicted_class}")
    return predicted_class


logger = logging.getLogger(__name__)
model_url = "https://share.andrea-joly.fr/api/shares/quiz-in/files/5d8ac08f-82ac-4b49-83be-1df749affccd"
download_model(model_url=model_url)
