# GECN College AI Chatbot

A React + Vite frontend with a Node.js + Express backend and OpenRouter AI.

## 1. Requirements

Install **Node.js 20.19+** (or a newer LTS version).

## 2. Run the backend

Open VS Code in the `GECN-chatbot` folder, then open a terminal:

```bash
cd backend
npm install
```

Create the environment file:

```bash
copy .env.example .env
```

Open `backend/.env` and replace:

```text
OPENROUTER_API_KEY=your_openrouter_key_here
```

with your own OpenRouter API key.

Then start the backend:

```bash
npm run dev
```

You should see:

```text
GECN College AI Backend is running at http://localhost:5000
```

If you do not add an API key, the app still runs in **Demo Mode** so you can test the frontend/backend connection.

## 3. Run the frontend

Keep the backend terminal open. Open a **second VS Code terminal**:

```bash
cd frontend
npm install
npm run dev
```

Vite will show a local address, normally:

```text
http://localhost:5173/
```

Open that address in Chrome.

## 4. Important

- Never put the API key in `frontend/src`.
- Never commit `backend/.env`.
- `backend/.env` is ignored by Git.
- The frontend uses `http://localhost:5000/api/chat` by default.
- For deployment, set `VITE_API_URL` to your deployed backend URL.

## 5. GitHub

From the project root:

```bash
git add .
git commit -m "Fix GECN AI chatbot local setup"
git push
```

Do **not** run `git add backend/.env`.

## Project structure

```text
GECN-chatbot/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── college-data/
└── README.md
```

The current version is ready for local testing. The next step for official college answers is adding verified GECN documents and RAG.
