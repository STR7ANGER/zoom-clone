from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session, selectinload

from ..config import FRONTEND_BASE_URL
from ..database import Base, SessionLocal, engine
from ..models import Meeting, MeetingInvite, Participant


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_to_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def format_utc_for_email(value: datetime) -> str:
    return normalize_to_utc(value).strftime("%b %d, %Y at %I:%M %p UTC")


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


def mark_meeting_recent_if_empty(db: Session, meeting_id: str) -> None:
    meeting = db.scalar(
        select(Meeting)
        .options(selectinload(Meeting.participants))
        .where(Meeting.meeting_id == meeting_id)
    )
    if not meeting or not meeting.participants:
        return

    has_active_participants = any(participant.left_at is None for participant in meeting.participants)
    if not has_active_participants and meeting.status != "recent":
        meeting.status = "recent"
        db.commit()


def reconcile_recent_meetings(db: Session) -> None:
    meetings = db.scalars(
        select(Meeting)
        .options(selectinload(Meeting.participants))
        .where(Meeting.status != "recent")
    ).all()
    changed = False
    for meeting in meetings:
        if meeting.participants and all(participant.left_at is not None for participant in meeting.participants):
            meeting.status = "recent"
            changed = True
    if changed:
        db.commit()


def create_participant(
    db: Session,
    meeting_id: str,
    display_name: str,
    role: str = "participant",
    avatar_url: str | None = None,
) -> Participant:
    participant = Participant(
        participant_id=uuid.uuid4().hex,
        meeting_id=meeting_id,
        display_name=display_name.strip(),
        avatar_url=avatar_url,
        role=role,
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


def ensure_schema() -> None:
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    meeting_columns = {column["name"] for column in inspector.get_columns("meetings")}
    if "host_user_id" not in meeting_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE meetings ADD COLUMN host_user_id INTEGER"))
    invite_columns = {column["name"] for column in inspector.get_columns("meeting_invites")}
    if "email" not in invite_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE meeting_invites ADD COLUMN email VARCHAR(255)"))
    participant_columns = {column["name"] for column in inspector.get_columns("participants")}
    if "avatar_url" not in participant_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE participants ADD COLUMN avatar_url VARCHAR(500)"))


def seed_database() -> None:
    ensure_schema()
    db = SessionLocal()
    try:
        existing = db.scalar(select(Meeting).limit(1))
        if existing:
            return

        now = utc_now()
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
