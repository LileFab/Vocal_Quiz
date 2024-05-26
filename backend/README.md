# Voice Quiz - Application
This folder provides a fullstack application to run the back and frontend.  

## Installation & usage

### With Docker
```bash
docker login devops.telecomste.fr:5050
```
```bash
docker run -d --restart unless-stopped -p 80:80 -e DATABASE_URL="postgresql://user:password@url:port/database?schema=public" -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=123456789abcdef -e CLERK_SECRET_KEY=123456789abcdef -e SENTRY_AUTH_TOKEN=123456789abcdef -e SENTRY_DSN="DSN" -e NEXT_PUBLIC_FLASK_API_URL="url" -e WEBHOOK_SECRET=123445azeerty devops.telecomste.fr:5050/joly.andrea/voice-quiz/quiz-in/backend
```
Open [http://localhost:80](http://localhost:80) with your browser to see the result.


### From Scratch

```bash
git clone https://devops.telecomste.fr/joly.andrea/voice-quiz.git
cd voice-quiz/backend
```

Before starting, 
- fill the .env file with the .env.example file
- run the ngrok tunnel: ```bash ngrok http --domain=my-domain port```

Install packages:
```bash
npm install
```
Build and fill the database:
```bash
npx prisma db push
npx tsc scripts/questions.ts
node scripts/questions.js
```
Build and start the application:
```bash
npm run build
npm run start
```
Open [http://localhost:80](http://localhost:80) with your browser to see the result.

To run the development server, use:
```bash
npm run dev
```