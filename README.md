# Zoom Clone Fullstack Assignment

This repository contains a Zoom-inspired video conferencing demo with a Next.js frontend and FastAPI backend.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, lucide-react
- Backend: Python, FastAPI, SQLAlchemy, WebSockets
- Database: SQLite
- Video: Browser WebRTC peer connections with FastAPI WebSocket signaling

## Project Structure

- `zoom_web`: Next.js single page application
- `zoom_api`: FastAPI backend and SQLite database layer

## Backend Setup

```bash
cd zoom_api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend creates and seeds `zoom_clone.db` automatically on startup.

## Frontend Setup

```bash
cd zoom_web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Frontend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend:

```bash
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_BASE_URL=http://localhost:3000
```

## Database Schema

- `meetings`: stores meeting ID, title, description, type, status, start time, duration, invite link, host name, and creation time.
- `participants`: stores participant ID, meeting relationship, display name, role, mute/camera state, join time, and leave time.

The relationship is one meeting to many participants, keyed by the public Zoom-like `meeting_id`.

## Core Workflows

- Dashboard shows upcoming and recent meetings from SQLite.
- New Meeting creates an instant meeting, generates a unique meeting ID and invite link, and opens the room.
- Join Meeting accepts a meeting ID or invite link, validates the meeting, asks for a display name, and creates a participant.
- Schedule Meeting stores title, description, date/time, duration, and generated invite link.
- Meeting Room supports real camera/mic, WebRTC peer connections, invite copying, participant list, mute/camera toggles, mute all, and participant removal.

## Assumptions

- No authentication is required. The app uses a default demo user named `Demo User` with initials `DU`.
- WebRTC is implemented for demo/interview scale using direct browser peer connections and a public STUN server.
- No TURN server is configured, so some restrictive production networks may need extra deployment work.

## Deployment Notes

- Deploy `zoom_web` to Vercel or Netlify and set `NEXT_PUBLIC_API_BASE_URL` to the backend URL.
- Deploy `zoom_api` to Render, Railway, or another Python host and set `FRONTEND_ORIGIN` and `FRONTEND_BASE_URL` to the deployed frontend URL.
- Ensure the backend host supports WebSockets.

