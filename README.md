# Quiz'In :microphone:
A simple vocal quiz game :sparkles:

## :hammer: Installation

### Production
#### Deployment with Docker
Connect to Gitlab Registry:
```
docker login devops.telecomste.fr:5050
```

**Deploy Database**
```
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=P@ssword1 -v ./data:/var/lib/postgresql/data devops.telecomste.fr:5050/joly.andrea/voice-qu
iz/quiz-in/database
```

#### Deployment from scratch
```
cd backend
npm run build
npm run start
```

### Development :pencil2:
**Prerequisites**
- Python :snake:
- Docker :whale:
- Node.js

---
```bash
git clone https://devops.telecomste.fr/joly.andrea/voice-quiz.git
```

**Database part** 
Image build
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=P@ssword1 -v ./data:/var/lib/postgresql/data devops.telecomste.fr:5050/joly.andrea/voice-quiz/quiz-in/database
```

Run the container 
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=P@ssword1 -v ./data:/var/lib/postgresql/data quiz-in/database:latest
```

**Backend Part**
```bash
cd backend
npm run dev
```







## :memo: License
This project is licensed under the terms of the MIT license.

## :busts_in_silhouette: Authors
- [Fleisch Fabien](https://fabien-fleisch.fr/)
- [Joly Andréa](https://andrea-joly.fr)
- [Jouve Adrien]()
- [Ramadier Loïck]()



