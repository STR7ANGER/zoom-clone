from __future__ import annotations

import json
import os
import random
import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from .database import Base, SessionLocal, engine, get_db
from .models import Meeting, Participant
from .schemas import (
    InstantMeetingCreate,
    InstantMeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
    MeetingOut,
    ParticipantOut,
    ParticipantPatch,
    ScheduledMeetingCreate,
)

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", FRONTEND_ORIGIN).rstrip("/")

app = FastAPI(title="Zoom Clone API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_ORIGIN,
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self) -> None:
        self.rooms: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, meeting_id: str, participant_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.rooms.setdefault(meeting_id, {})[participant_id] = websocket

    def disconnect(self, meeting_id: str, participant_id: str) -> None:
        room = self.rooms.get(meeting_id)
        if not room:
            return
        room.pop(participant_id, None)
        if not room:
            self.rooms.pop(meeting_id, None)

    async def send(self, meeting_id: str, participant_id: str, payload: dict[str, Any]) -> None:
        websocket = self.rooms.get(meeting_id, {}).get(participant_id)
        if websocket:
            try:
                await websocket.send_json(payload)
            except Exception:
                self.disconnect(meeting_id, participant_id)

    async def broadcast(
        self,
        meeting_id: str,
        payload: dict[str, Any],
        exclude: str | None = None,
    ) -> None:
        for participant_id, websocket in list(self.rooms.get(meeting_id, {}).items()):
            if participant_id != exclude:
                try:
                    await websocket.send_json(payload)
                except Exception:
                    self.disconnect(meeting_id, participant_id)


manager = ConnectionManager()


def generate_meeting_id(db: Session) -> str:
    while True:
        meeting_id = f"{random.randint(100, 999)}{random.randint(100, 999)}{random.randint(100, 999)}"
        exists = db.scalar(select(Meeting).where(Meeting.meeting_id == meeting_id))
        if not exists:
            return meeting_id


def invite_link(meeting_id: str) -> str:
    return f"{FRONTEND_BASE_URL}/join?meeting={meeting_id}"


def get_meeting_or_404(db: Session, meeting_id: str) -> Meeting:
    meeting = db.scalar(
        select(Meeting)
        .options(selectinload(Meeting.participants))
        .where(Meeting.meeting_id == meeting_id)
    )
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


def create_participant(
    db: Session,
    meeting_id: str,
    display_name: str,
    role: str = "participant",
) -> Participant:
    participant = Participant(
        participant_id=uuid.uuid4().hex,
        meeting_id=meeting_id,
        display_name=display_name.strip(),
        role=role,
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


def seed_database() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.scalar(select(Meeting).limit(1))
        if existing:
            return

        now = datetime.utcnow()
        seed_meetings = [
            Meeting(
                meeting_id=generate_meeting_id(db),
                title="Product standup",
                description="Daily product and engineering sync.",
                meeting_type="scheduled",
                status="upcoming",
                starts_at=now + timedelta(hours=3),
                duration_minutes=30,
                invite_link="",
                host_name="Demo User",
            ),
            Meeting(
                meeting_id=generate_meeting_id(db),
                title="Design review",
                description="Review dashboard and meeting room updates.",
                meeting_type="scheduled",
                status="upcoming",
                starts_at=now + timedelta(days=1, hours=2),
                duration_minutes=45,
                invite_link="",
                host_name="Demo User",
            ),
            Meeting(
                meeting_id=generate_meeting_id(db),
                title="Interview prep",
                description="Practice walkthrough of project decisions.",
                meeting_type="instant",
                status="recent",
                starts_at=now - timedelta(days=1),
                duration_minutes=40,
                invite_link="",
                host_name="Demo User",
            ),
        ]
        for meeting in seed_meetings:
            meeting.invite_link = invite_link(meeting.meeting_id)
            db.add(meeting)
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    seed_database()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/meetings", response_model=list[MeetingOut])
def list_meetings(
    status: str | None = Query(default=None, pattern="^(upcoming|recent)$"),
    db: Session = Depends(get_db),
) -> list[Meeting]:
    statement = select(Meeting).options(selectinload(Meeting.participants))
    if status:
        statement = statement.where(Meeting.status == status)
    statement = statement.order_by(Meeting.starts_at.asc())
    return list(db.scalars(statement).all())


@app.post("/meetings/instant", response_model=InstantMeetingResponse, status_code=201)
def create_instant_meeting(
    payload: InstantMeetingCreate,
    db: Session = Depends(get_db),
) -> dict[str, Meeting | Participant]:
    meeting_id = generate_meeting_id(db)
    meeting = Meeting(
        meeting_id=meeting_id,
        title=f"{payload.host_display_name.strip()}'s Zoom Meeting",
        description="Instant meeting",
        meeting_type="instant",
        status="upcoming",
        starts_at=datetime.utcnow(),
        duration_minutes=40,
        invite_link=invite_link(meeting_id),
        host_name=payload.host_display_name.strip(),
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    participant = create_participant(db, meeting_id, payload.host_display_name, role="host")
    meeting = get_meeting_or_404(db, meeting_id)
    return {"meeting": meeting, "participant": participant}


@app.post("/meetings/scheduled", response_model=MeetingOut, status_code=201)
def create_scheduled_meeting(
    payload: ScheduledMeetingCreate,
    db: Session = Depends(get_db),
) -> Meeting:
    meeting_id = generate_meeting_id(db)
    meeting = Meeting(
        meeting_id=meeting_id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        meeting_type="scheduled",
        status="upcoming",
        starts_at=payload.starts_at,
        duration_minutes=payload.duration_minutes,
        invite_link=invite_link(meeting_id),
        host_name=payload.host_name.strip(),
    )
    db.add(meeting)
    db.commit()
    return get_meeting_or_404(db, meeting_id)


@app.get("/meetings/{meeting_id}", response_model=MeetingOut)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)) -> Meeting:
    return get_meeting_or_404(db, meeting_id)


@app.post("/meetings/{meeting_id}/join", response_model=JoinMeetingResponse)
def join_meeting(
    meeting_id: str,
    payload: JoinMeetingRequest,
    db: Session = Depends(get_db),
) -> dict[str, Meeting | Participant]:
    meeting = get_meeting_or_404(db, meeting_id)
    existing_host = next(
        (
            participant
            for participant in meeting.participants
            if participant.role == "host" and participant.left_at is None
        ),
        None,
    )
    role = (
        "host"
        if existing_host is None and payload.display_name.strip().lower() == meeting.host_name.strip().lower()
        else "participant"
    )
    participant = create_participant(db, meeting_id, payload.display_name, role=role)
    meeting = get_meeting_or_404(db, meeting_id)
    return {"meeting": meeting, "participant": participant}


@app.patch("/participants/{participant_id}", response_model=ParticipantOut)
async def update_participant(
    participant_id: str,
    payload: ParticipantPatch,
    db: Session = Depends(get_db),
) -> Participant:
    participant = db.scalar(select(Participant).where(Participant.participant_id == participant_id))
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    if payload.muted is not None:
        participant.muted = payload.muted
    if payload.camera_on is not None:
        participant.camera_on = payload.camera_on
    if payload.left:
        participant.left_at = datetime.utcnow()
    db.commit()
    db.refresh(participant)
    await manager.broadcast(
        participant.meeting_id,
        {
            "type": "participant-updated",
            "participant": ParticipantOut.model_validate(participant).model_dump(mode="json"),
        },
    )
    return participant


@app.delete("/meetings/{meeting_id}/participants/{participant_id}", status_code=204)
async def remove_participant(
    meeting_id: str,
    participant_id: str,
    db: Session = Depends(get_db),
) -> None:
    participant = db.scalar(
        select(Participant).where(
            Participant.meeting_id == meeting_id,
            Participant.participant_id == participant_id,
        )
    )
    if participant:
        participant.left_at = datetime.utcnow()
        db.commit()
    await manager.send(meeting_id, participant_id, {"type": "removed"})
    await manager.broadcast(meeting_id, {"type": "participant-left", "participantId": participant_id}, exclude=participant_id)
    manager.disconnect(meeting_id, participant_id)


@app.websocket("/ws/meetings/{meeting_id}")
async def meeting_socket(
    websocket: WebSocket,
    meeting_id: str,
    participant_id: str = Query(...),
) -> None:
    db = SessionLocal()
    try:
        participant = db.scalar(
            select(Participant).where(
                Participant.meeting_id == meeting_id,
                Participant.participant_id == participant_id,
            )
        )
        if not participant:
            await websocket.close(code=4404)
            return

        await manager.connect(meeting_id, participant_id, websocket)
        active_ids = [
            pid
            for pid in manager.rooms.get(meeting_id, {})
            if pid != participant_id
        ]
        await websocket.send_json({"type": "existing-participants", "participants": active_ids})
        await manager.broadcast(
            meeting_id,
            {
                "type": "participant-joined",
                "participant": ParticipantOut.model_validate(participant).model_dump(mode="json"),
            },
            exclude=participant_id,
        )

        while True:
            raw_message = await websocket.receive_text()
            message = json.loads(raw_message)
            message["from"] = participant_id
            target = message.get("target")
            if target:
                await manager.send(meeting_id, target, message)
            else:
                await manager.broadcast(meeting_id, message, exclude=participant_id)
    except WebSocketDisconnect:
        pass
    finally:
        participant = db.scalar(
            select(Participant).where(
                Participant.meeting_id == meeting_id,
                Participant.participant_id == participant_id,
            )
        )
        if participant and participant.left_at is None:
            participant.left_at = datetime.utcnow()
            db.commit()
        db.close()
        manager.disconnect(meeting_id, participant_id)
        await manager.broadcast(meeting_id, {"type": "participant-left", "participantId": participant_id})


seed_database()
