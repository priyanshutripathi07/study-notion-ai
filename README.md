# StudyNotion

StudyNotion — a student-first learning helper built with React + Tailwind + Node (backend).  
Features: AI Doubt Solver, Quiz Generator, Summarize Notes, History, Bookmarks, Profile, Dark mode.

## Run locally

1. Backend:
   - `cd study-notion-backend`
   - `npm i`
   - Create `.env` (copy `.env.example`), set keys (HF / OpenRouter / GEMINI) if used.
   - `node server.cjs`

2. Frontend:
   - `cd study-notion-frontend`
   - `npm i`
   - Create `.env` and set `VITE_API_BASE=http://127.0.0.1:5000` if needed.
   - `npm run dev`

## Notes
- History and AI responses are stored in-memory on the backend (demo). For persistence, we recommend using a database (SQLite / Postgres).
- Bookmarks are stored in the browser `localStorage`.
- Passwords are stored in-memory (demo only). **Do not** use this approach in production.

Made with ❤️ by Priyanshu Tripathi
