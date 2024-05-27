# Quiz'In :microphone:
A simple vocal quiz game :sparkles:
This repository contains the code for the Quiz'In application. This application is composed of a backend developed with Next.js and a deep learning model built using PyTorch.

## :hammer: Installation for production

### Deployment with Docker
1. Clone the project
```bash
git clone https://devops.telecomste.fr/joly.andrea/voice-quiz.git](https://github.com/LileFab/Vocal_Quiz.git
```
2. Sign in to gitlab registry
```bash
docker login devops.telecomste.fr:5050
```
3. Fill .env file withe the .env.example file.
```bash
vi .env
```
4. Run the docker compose file
```bash
docker compose up -d
```

### Deployment from scratch

**Prerequisites**
- Python :snake:
- Docker :whale:
- Node.js
- Ngrok

**Installation**  
First, clone the project:
```bash
git clone https://devops.telecomste.fr/joly.andrea/voice-quiz.git
```

Sign in to gitlab registry:
```bash
docker login devops.telecomste.fr:5050
```

**Deploy database**
```bash
cd database
docker run -d --restart always -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -v ./data:/var/lib postgresql/data quiz-in/database:latest
```

**Deploy model API**
```bash
cd model
pip install -r requirements_prod.txt
gunicorn --bind=0.0.0.0:5000 server:flask_app
```

To run the developmet mode, use:
```bash
python3 server.py
```


**Deploy backend**
```bash
cd backend
npm install
npx prisma db push
npx tsc scripts/questions.ts
node scripts/questions.js
npm run build
npm run start
```

To run the developmet mode, use:
```bash
npm run dev
```

## :memo: License
This project is licensed under the terms of the MIT license.

## :busts_in_silhouette: Authors
- [Fleisch Fabien](https://fabien-fleisch.fr/)
- [Joly Andréa](https://andrea-joly.fr)
- [Jouve Adrien]()
- [Ramadier Loïck]()
