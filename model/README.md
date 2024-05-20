# Voice Quiz - Model part

## Download dataset
```bash
curl --output data.tar.gz https://share.andrea-joly.fr/api/shares/quiz/files/9a2ceb4c-6495-40f0-9f78-6814ea9990d8
```


## Download model
```bash
mkdir models
curl --output models/model_v1.pth https://share.andrea-joly.fr/api/shares/quiz/files/8a8da64c-1464-4e20-ad29-3dee3586e00d
```

## API Routes
```bash
curl http://ip:port/ # Return "Hello World !"
curl -X POST -F "file=@file.wav" http://ip:port/speech_to_text
```

## Development
```bash
python server.py
```

## Production
```bash
docker build -t voice-quiz/model_api:latest .
docker run -p 80:5000 voice-quiz/model_api:latest
```
