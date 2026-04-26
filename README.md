# Zoom Clone Fullstack Assignment

A Zoom-inspired fullstack app with:
- a `Next.js` frontend (`zoom_web`)
- a `FastAPI` backend (`zoom_api`)
- `SQLite` persistence
- `WebRTC` peer-to-peer media with backend WebSocket signaling

## Repository Layout

- `zoom_web`: Next.js 16 app (landing page, auth, dashboard, meeting room)
- `zoom_api`: FastAPI service (auth, meetings, participants, websocket signaling)

## Features

- Email/password signup and login
- Google OAuth login
- JWT-based API auth from frontend to backend
- Instant meeting creation and scheduled meetings
- Invite links and optional email invite notifications
- Upcoming and recent meeting lists per authenticated user
- Meeting room with live participant presence, mic/camera toggles, host controls, and WebRTC signaling

## Quick Start

1) Clone and set env files

```bash
cp zoom_api/.env.example zoom_api/.env
cp zoom_web/.env.example zoom_web/.env.local
```

2) Start backend

```bash
cd zoom_api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

3) Start frontend (new terminal)

```bash
cd zoom_web
npm install
npm run dev
```

4) Open `http://localhost:3000`

## Environment Variables

### Frontend (`zoom_web/.env.local`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`zoom_api/.env`)

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

## Notes

- On startup, the backend creates schema and seeds initial meetings if the database is empty.
- For local development, SQLite works out of the box.
- WebSockets are required for realtime room events and signaling.
- For production-grade media reliability, add TURN infrastructure (STUN-only is limited on restrictive networks).
