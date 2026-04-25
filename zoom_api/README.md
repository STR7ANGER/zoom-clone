# Zoom API

FastAPI backend for the Zoom clone assignment.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The SQLite database is created automatically at `zoom_clone.db`.

