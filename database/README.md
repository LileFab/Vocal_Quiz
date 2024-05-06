# Quiz'In - Database part

## Construction de l'image
```
docker build -t quiz-in/database:latest .
```

## Lancement du container
```
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=P@ssword1 -v ./data:/var/lib/postgresql/data quiz-in/database:latest
```
