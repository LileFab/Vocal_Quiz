# Voice Quiz - Model part
This folder provides an API for interacting with a deep learning model that processes 16-bit WAV audio files.  
The API accepts WAV files as input and returns string as predictions based on the model's analysis.

## Installation & usage

### With Docker
```bash
docker login devops.telecomste.fr:5050
docker run -d -p 5000:5000 devops.telecomste.fr:5050/joly.andrea/voice-quiz/quiz-in/model-api
```
The API will be available at http://localhost:5000.


### From Scratch
```bash
git clone https://devops.telecomste.fr/joly.andrea/voice-quiz.git
cd voice-quiz/model
pip install -r requirements_prod.txt
gunicorn --bind=0.0.0.0:5000 server:flask_app
```
The API will be available at http://localhost:5000.

## API Endpoints
The API exposes the following endpoints:
* `/`:  
    Method: GET  
    Description: Returns "Hello World !".  
    Example:
    ```bash curl http://localhost:5000/```
    
* `/speech_to_text`:  
    Method: POST  
    Description: Transcribes speech from a WAV file to text.  
    Parameters: WAV file (16-bit) to be transcribed.  
    Example:
    ```curl -X POST -F "file=@record.wav" http://localhost:5000/speech_to_text```
    
## Model description
The model is designed to analyze 16-bit WAV files and provide predictions based on the audio content {"oui", "non", "un", "deux", "trois", "quatre"}. The specific task and details about the model (e.g., architecture, training data, etc.) should be described here.


## Appendices 
### Download the dataset used to train the model
```bash
curl --output data.tar.gz https://share.andrea-joly.fr/api/shares/quiz-in/files/f15ca738-8eff-499e-917b-b5822ff24152
```

### Download the model
```bash
curl --output model.pth https://share.andrea-joly.fr/api/shares/quiz-in/files/5d8ac08f-82ac-4b49-83be-1df749affccd
```