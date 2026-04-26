from __future__ import annotations

import json
import random
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlencode

import httpx
from fastapi import Depends, FastAPI, HTTPException, Query, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import inspect, or_, select, text
from sqlalchemy.orm import Session, selectinload

from .auth import (
    create_access_token,
    find_user_by_email,
    get_current_user,
    get_optional_current_user,
    hash_password,
    normalize_email,
    validate_email,
    verify_password,
)
from .config import (
    CORS_ORIGINS,
    FRONTEND_BASE_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
)
from .database import Base, SessionLocal, engine, get_db
from .mailer import send_meeting_invite
from .models import Meeting, MeetingInvite, Participant, User
from .schemas import (
    AuthResponse,
    InstantMeetingCreate,
    InstantMeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
    LoginRequest,
    MeetingOut,
    ParticipantOut,
    ParticipantPatch,
    ScheduledMeetingCreate,
    SignupRequest,
    UserOut,
)

app = FastAPI(title="Zoom Clone API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
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

    def is_current(self, meeting_id: str, participant_id: str, websocket: WebSocket) -> bool:
        return self.rooms.get(meeting_id, {}).get(participant_id) is websocket

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


def auth_payload(user: User) -> AuthResponse:
    return AuthResponse(access_token=create_access_token(user), user=UserOut.model_validate(user))


def valid_invitees(invitees: list[str]) -> list[str]:
    normalized: list[str] = []
    for invitee in invitees:
        email = normalize_email(invitee)
        if not email:
            continue
        if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
            raise HTTPException(status_code=422, detail=f"Invalid invite email: {invitee}")
        if email not in normalized:
            normalized.append(email)
    return normalized


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


@app.on_event("startup")
def on_startup() -> None:
    seed_database()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/signup", response_model=AuthResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = validate_email(payload.email)
    if find_user_by_email(db, email):
        raise HTTPException(status_code=409, detail="An account already exists for this email")
    user = User(
        email=email,
        name=payload.name.strip(),
        password_hash=hash_password(payload.password),
        auth_provider="email",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return auth_payload(user)


@app.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = find_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return auth_payload(user)


@app.get("/auth/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@app.get("/auth/google/start")
def google_start(next: str = "/myhome") -> RedirectResponse:
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured")
    if not next.startswith("/"):
        next = "/myhome"
    state_payload = f"{secrets.token_urlsafe(16)}|{next}"
    query = urlencode(
        {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "select_account",
            "state": state_payload,
        }
    )
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@app.get("/auth/google/callback")
async def google_callback(
    code: str,
    state: str = "",
    db: Session = Depends(get_db),
) -> RedirectResponse:
    next_path = "/myhome"
    if "|" in state:
        next_path = state.split("|", 1)[1] or next_path
    if not next_path.startswith("/"):
        next_path = "/myhome"

    async with httpx.AsyncClient(timeout=15) as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_response.status_code >= 400:
            raise HTTPException(status_code=401, detail="Google sign in failed")
        access_token = token_response.json().get("access_token")
        profile_response = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if profile_response.status_code >= 400:
            raise HTTPException(status_code=401, detail="Unable to read Google profile")
        profile = profile_response.json()

    email = validate_email(profile.get("email", ""))
    user = find_user_by_email(db, email)
    if user:
        user.name = profile.get("name") or user.name
        user.avatar_url = profile.get("picture") or user.avatar_url
        user.google_sub = profile.get("sub") or user.google_sub
        if user.auth_provider == "email":
            user.auth_provider = "google"
    else:
        user = User(
            email=email,
            name=profile.get("name") or email.split("@", 1)[0],
            avatar_url=profile.get("picture"),
            google_sub=profile.get("sub"),
            auth_provider="google",
        )
        db.add(user)
    db.commit()
    db.refresh(user)

    frontend_query = urlencode({"token": create_access_token(user), "next": next_path})
    return RedirectResponse(f"{FRONTEND_BASE_URL}/auth/callback?{frontend_query}")


@app.get("/meetings", response_model=list[MeetingOut])
def list_meetings(
    status: str | None = Query(default=None, pattern="^(upcoming|recent)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Meeting]:
    reconcile_recent_meetings(db)
    invited_meeting_ids = select(MeetingInvite.meeting_id).where(MeetingInvite.user_id == current_user.id)
    statement = (
        select(Meeting)
        .options(selectinload(Meeting.participants))
        .where(or_(Meeting.host_user_id == current_user.id, Meeting.meeting_id.in_(invited_meeting_ids)))
    )
    if status:
        statement = statement.where(Meeting.status == status)
    if status == "recent":
        statement = statement.order_by(Meeting.starts_at.desc())
    else:
        statement = statement.order_by(Meeting.starts_at.asc())
    return list(db.scalars(statement).all())


@app.post("/meetings/instant", response_model=InstantMeetingResponse, status_code=201)
def create_instant_meeting(
    payload: InstantMeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Meeting | Participant]:
    meeting_id = generate_meeting_id(db)
    host_name = current_user.name.strip()
    meeting = Meeting(
        meeting_id=meeting_id,
        title=f"{host_name}'s Zoom Meeting",
        description="Instant meeting",
        meeting_type="instant",
        status="upcoming",
        starts_at=utc_now(),
        duration_minutes=40,
        invite_link=invite_link(meeting_id),
        host_name=host_name,
        host_user_id=current_user.id,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    participant = create_participant(db, meeting_id, host_name, role="host", avatar_url=current_user.avatar_url)
    meeting = get_meeting_or_404(db, meeting_id)
    return {"meeting": meeting, "participant": participant}


@app.post("/meetings/scheduled", response_model=MeetingOut, status_code=201)
def create_scheduled_meeting(
    payload: ScheduledMeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Meeting:
    meeting_id = generate_meeting_id(db)
    host_name = current_user.name.strip()
    meeting = Meeting(
        meeting_id=meeting_id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        meeting_type="scheduled",
        status="upcoming",
        starts_at=normalize_to_utc(payload.starts_at),
        duration_minutes=payload.duration_minutes,
        invite_link=invite_link(meeting_id),
        host_name=host_name,
        host_user_id=current_user.id,
    )
    db.add(meeting)
    db.commit()
    for invitee in valid_invitees(payload.invitees):
        invited_user = find_user_by_email(db, invitee)
        if invited_user and invited_user.id != current_user.id:
            existing_invite = db.scalar(
                select(MeetingInvite).where(
                    MeetingInvite.meeting_id == meeting.meeting_id,
                    MeetingInvite.user_id == invited_user.id,
                )
            )
            if not existing_invite:
                db.add(
                    MeetingInvite(
                        meeting_id=meeting.meeting_id,
                        user_id=invited_user.id,
                        email=invited_user.email,
                    )
                )
                db.commit()
        send_meeting_invite(
            to_email=invitee,
            title=meeting.title,
            starts_at=format_utc_for_email(meeting.starts_at),
            duration_minutes=meeting.duration_minutes,
            invite_link=meeting.invite_link,
            host_name=meeting.host_name,
        )
    return get_meeting_or_404(db, meeting_id)


@app.get("/meetings/{meeting_id}", response_model=MeetingOut)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)) -> Meeting:
    return get_meeting_or_404(db, meeting_id)


@app.post("/meetings/{meeting_id}/join", response_model=JoinMeetingResponse)
def join_meeting(
    meeting_id: str,
    payload: JoinMeetingRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
) -> dict[str, Meeting | Participant]:
    meeting = get_meeting_or_404(db, meeting_id)
    display_name = current_user.name if current_user else payload.display_name
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
        if current_user and current_user.id == meeting.host_user_id
        else "host"
        if existing_host is None and display_name.strip().lower() == meeting.host_name.strip().lower()
        else "participant"
    )
    participant = create_participant(
        db,
        meeting_id,
        display_name,
        role=role,
        avatar_url=current_user.avatar_url if current_user else None,
    )
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
        participant.left_at = utc_now()
    db.commit()
    db.refresh(participant)
    if payload.left:
        mark_meeting_recent_if_empty(db, participant.meeting_id)
    await manager.broadcast(
        participant.meeting_id,
        {
            "type": "participant-updated",
            "participant": ParticipantOut.model_validate(participant).model_dump(mode="json"),
        },
    )
    return participant


@app.delete(
    "/meetings/{meeting_id}/participants/{participant_id}",
    status_code=204,
    response_class=Response,
    response_model=None,
)
async def remove_participant(
    meeting_id: str,
    participant_id: str,
    db: Session = Depends(get_db),
) -> Response:
    participant = db.scalar(
        select(Participant).where(
            Participant.meeting_id == meeting_id,
            Participant.participant_id == participant_id,
        )
    )
    if participant:
        participant.left_at = utc_now()
        db.commit()
        mark_meeting_recent_if_empty(db, meeting_id)
    await manager.send(meeting_id, participant_id, {"type": "removed"})
    await manager.broadcast(meeting_id, {"type": "participant-left", "participantId": participant_id}, exclude=participant_id)
    manager.disconnect(meeting_id, participant_id)
    return Response(status_code=204)


@app.post(
    "/meetings/{meeting_id}/end",
    status_code=204,
    response_class=Response,
    response_model=None,
)
async def end_meeting(
    meeting_id: str,
    participant_id: str = Query(...),
    db: Session = Depends(get_db),
) -> Response:
    meeting = get_meeting_or_404(db, meeting_id)
    participant = db.scalar(
        select(Participant).where(
            Participant.meeting_id == meeting_id,
            Participant.participant_id == participant_id,
        )
    )
    if not participant or participant.role != "host":
        raise HTTPException(status_code=403, detail="Only the host can end this meeting")

    now = utc_now()
    meeting.status = "recent"
    for active_participant in meeting.participants:
        if active_participant.left_at is None:
            active_participant.left_at = now
    db.commit()
    await manager.broadcast(meeting_id, {"type": "meeting-ended"})
    manager.rooms.pop(meeting_id, None)
    return Response(status_code=204)


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
        if not manager.is_current(meeting_id, participant_id, websocket):
            db.close()
            return
        participant = db.scalar(
            select(Participant).where(
                Participant.meeting_id == meeting_id,
                Participant.participant_id == participant_id,
            )
        )
        if participant and participant.left_at is None:
            participant.left_at = utc_now()
            db.commit()
            mark_meeting_recent_if_empty(db, meeting_id)
        db.close()
        manager.disconnect(meeting_id, participant_id)
        await manager.broadcast(meeting_id, {"type": "participant-left", "participantId": participant_id})
