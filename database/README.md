# Quiz'In - Database part

## Run container
```
docker run -d -restart --unless-stopped -p 5432:5432 -e POSTGRES_PASSWORD=P@ssword1 -v ./data:/var/lib/postgresql/data devops.telecomste.fr:5050/joly.andrea/voice-quiz/quiz-in/database
```
