# Multi-Agent Negotiation Simulator — React Frontend

The Streamlit UI has been replaced by a modern React/Vite frontend while the existing FastAPI backend and AI negotiation logic remain intact.

## Run backend

From the project root:

```powershell
.env\Scripts\Activate.ps1
python -m uvicorn backend.api:app --reload
```

Backend: http://127.0.0.1:8000

## Run frontend

Open a second terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

Do not put Gemini or Supabase secrets in the frontend `.env`. Only `VITE_API_URL` belongs there.

## Architecture

React/Vite frontend -> FastAPI -> existing orchestrator/AI agents/database.

The original Streamlit files are retained for reference. The new frontend is under `frontend/`.
