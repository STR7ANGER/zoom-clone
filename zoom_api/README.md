# Zoom API

FastAPI backend for the Zoom clone assignment.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The SQLite database is created automatically at `zoom_clone.db`.

## Environment

```bash
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_BASE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
DATABASE_URL=sqlite:///./zoom_clone.db
```
