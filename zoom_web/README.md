# Zoom Web

Next.js frontend for the Zoom clone app.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Zustand (auth state)
- WebRTC browser APIs for media/peer connections

## Pages and Flows

- `/`: marketing landing page
- `/signin` and `/signup`: email auth + Google OAuth entry
- `/myhome`: authenticated dashboard with upcoming/recent meetings
- `/join`: join by meeting ID or invite link
- `/schedule`: create scheduled meetings
- `/meeting/[meetingId]`: live meeting room experience
- `/auth/callback`: receives OAuth token redirect and restores session

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Run

```bash
npm install
npm run dev
```

App URL: `http://localhost:3000`

## Scripts

- `npm run dev`: start local dev server (Turbopack)
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: eslint checks
- `npm run typecheck`: TypeScript checks
- `npm run format`: format `ts/tsx` files with Prettier

## Notes

- API requests use `NEXT_PUBLIC_API_BASE_URL` and include JWT bearer tokens from local auth state.
- Realtime room updates and signaling connect to backend websocket endpoints derived from the API base URL.
- Meeting-room controls (mic/camera, participants, host actions) rely on backend participant and meeting APIs.
