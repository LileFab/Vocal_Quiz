# Voice Quiz - Model
This folder provides a deep learning model and an API to interact with the model.  
The API accepts 16-bit WAV audio files as input and returns string {"oui", "non", "un", "deux", "trois", "quatre"} as predictions based on the model's analysis.

## Model description
The model is a Long Short-Term Memory (LSTM) network, a type of recurrent neural network (RNN). With an accuracy of 93%, the model was trained on the [Common Voice](https://commonvoice.mozilla.org/fr/datasets) dataset provided by Mozilla.


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
    

## Appendices 
### Download the dataset used to train the model
```bash
curl --output data.tar.gz https://share.andrea-joly.fr/api/shares/quiz-in/files/f15ca738-8eff-499e-917b-b5822ff24152
```

### Download the model pre-trained
```bash
curl --output model.pth https://share.andrea-joly.fr/api/shares/quiz-in/files/5d8ac08f-82ac-4b49-83be-1df749affccd
```