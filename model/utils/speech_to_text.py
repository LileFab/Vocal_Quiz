import os
import requests
import torch
from utils.lstm import LSTM
from utils.preprocess import (
    spectrogram_to_tensor_save,
    audio_to_mel_spectrogram_db,
    normalize
)

model_url = "https://share.andrea-joly.fr/api/shares/lstm-v1/files/5101ef88-68e7-4e96-9d1a-f5ff1c1042f1"
folder_name = "model"
model_name = "model.pth"
# download_model(folder_name=folder_name, model_url=model_url, model_name=model_name)
sentence = {0: 'oui', 1: 'non', 2: 'un', 3: 'deux', 4: 'trois', 5: 'quatre'}


def download_model(folder_name, model_url, model_name):
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    try:
        response = requests.get(model_url)
        if response.status_code == 200:
            with open(f"{folder_name}/{model_name}", "wb") as file:
                file.write(response.content)

    except requests.exceptions.HTTPError as http_err:
        print(f"Erreur HTTP: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Erreur de connexion: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        print(f"Délai d'attente dépassé: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"Erreur de requête: {req_err}")
    except Exception as e:
        print(f"Une erreur s'est produite: {e}")


def load_model(folder_name, model_name):
    num_layers = 4
    hidden_size = 50
    num_classes = 6
    dropout = 0.25
    sequence_length = 128
    input_size = 465
    model = LSTM(input_size, hidden_size, num_layers, num_classes,
                 sequence_length, dropout)
    model.load_state_dict(torch.load(f"{folder_name}/{model_name}",
                                     map_location=torch.device('cpu')))
    model.eval()
    return model


def instance_speech_to_text(file):
    mel_spectrogram_db = audio_to_mel_spectrogram_db(file)
    spectrogram_to_tensor_save([mel_spectrogram_db], 'mel_spec_wav')
    input_tensor = torch.load('data/mel_spec_wav.pt')
    input_tensor = normalize(input_tensor)
    lstm = load_model("model", "model.pth")
    with torch.no_grad():
        output = lstm(input_tensor)
    predicted_class_index = torch.argmax(output).item()
    predicted_class = sentence[predicted_class_index]
    return predicted_class
