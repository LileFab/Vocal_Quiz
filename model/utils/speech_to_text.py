import os
import requests
import torch

model_url = "https://share.andrea-joly.fr/api/shares/quiz/files/8a8da64c-1464-4e20-ad29-3dee3586e00d"

if not os.path.exists("model"):
    os.makedirs('model')

try:
    response = requests.get(model_url) 
    if response.status_code == 200 :
        with open("model/", "wb") as file: 
            file.write(response.content)
   
except:
    print("model not acessible")


model = torch.load("model/model_v1.pth")

def transform_wav():
    pass

def get_prediction(wav_file):
    flow = transform_wav(wav_file)
    out = model(flow)
    return out

def instance_speech_to_text(audio):
    