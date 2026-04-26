# Zoom API

FastAPI backend for the Zoom clone app.

## Stack

- FastAPI + Uvicorn
- SQLAlchemy ORM
- SQLite (default)
- JWT auth
- Google OAuth callback handling
- WebSocket signaling for meeting rooms

## Run Locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Service URL: `http://localhost:8000`

Health check:

```bash
GET /health
```

## Main Routes

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/google/start`
- `GET /auth/google/callback`

### Meetings

- `GET /meetings`
- `POST /meetings/instant`
- `POST /meetings/scheduled`
- `GET /meetings/{meeting_id}`
- `POST /meetings/{meeting_id}/join`
- `DELETE /meetings/{meeting_id}/participants/{participant_id}`
- `POST /meetings/{meeting_id}/end`

### Participants

- `PATCH /participants/{participant_id}`

### WebSocket

- `WS /ws/meetings/{meeting_id}?participant_id=...`

## Environment

Copy `.env.example` to `.env` and set values:

```bash
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_BASE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
DATABASE_URL=sqlite:///./zoom_clone.db

JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=10080

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-address@gmail.com
SMTP_APP_PASSWORD=your-gmail-app-password
MAIL_FROM=your-gmail-address@gmail.com
```

## Database Behavior

- Tables are created automatically on startup.
- Lightweight schema migration checks run at startup for existing SQLite files.
- Initial seed meetings are inserted only when the database is empty.

## Deploy Note (Render)

`runtime.txt` pins Python to `3.12.7` to avoid `pydantic-core` build issues on unsupported preview runtimes.
