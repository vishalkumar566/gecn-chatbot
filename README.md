# GECN College AI - NVIDIA NIM

This project uses NVIDIA NIM through its OpenAI-compatible API endpoint.

## 1. Configure the API key

Open `backend/.env` and set:

NVIDIA_API_KEY=YOUR_NEW_NVIDIA_API_KEY
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
PORT=5000

Never commit `.env` or share the API key. If a key was exposed publicly, revoke it and create a new one.

## 2. Start backend

Windows: double-click `START-BACKEND.bat`

Or in VS Code terminal:

cd backend
npm install
npm run dev

Check: http://localhost:5000

Expected JSON includes `provider: "NVIDIA NIM"` and `ai: true` when the key is configured.

## 3. Start frontend

Windows: double-click `START-FRONTEND.bat`

Or in another VS Code terminal:

cd frontend
npm install
npm run dev

Open exactly: http://localhost:5173

The Vite server uses `strictPort`, so it will NOT silently move to 5174/5175. If 5173 is already in use, stop the old Vite process with Ctrl+C and restart.

## 4. Important

The frontend must be opened from this project's `frontend` folder. If you see the old message beginning with `Demo response:`, you are running an older copy of the project; the NVIDIA version does not contain that demo response.

The college knowledge base is in `backend/college-knowledge.json`. It is grounding/context, not model fine-tuning.
