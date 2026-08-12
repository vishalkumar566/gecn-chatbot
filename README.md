# GECN College AI Chatbot

React + Vite frontend, Node.js + Express backend, and OpenRouter AI.

## Security
Do NOT put an API key in frontend code or commit `.env` to GitHub.
The API key shared in chat has been exposed, so revoke/rotate it and create a new key before using this project.

## Run locally

Backend:
```bash
cd backend
npm install
```
Create `backend/.env` from `.env.example`, add your NEW key, then:
```bash
npm run dev
```

Frontend, in another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally http://localhost:5173.

## Default model
`openai/gpt-oss-120b:free`

Change it with `OPENROUTER_MODEL` in `backend/.env`.

## GitHub
```bash
git init
git add .
git commit -m "Initial GECN college AI chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GECN-College-AI-Chatbot.git
git push -u origin main
```

Never commit `.env`.

## Next phase
Add approved college PDFs and implement RAG + Supabase for official college knowledge, notices, fees, hostel, departments, exams and placements.
