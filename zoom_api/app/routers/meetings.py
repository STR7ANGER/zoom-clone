from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from ..auth import find_user_by_email, get_current_user, get_optional_current_user
from ..database import get_db
from ..mailer import send_meeting_invite
from ..models import Meeting, MeetingInvite, Participant, User
from ..schemas import (
    InstantMeetingCreate,
    InstantMeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
    MeetingOut,
    ScheduledMeetingCreate,
)
from ..services.invites import valid_invitees
from ..services.meetings import (
    create_participant,
    format_utc_for_email,
    generate_meeting_id,
    get_meeting_or_404,
    invite_link,
    mark_meeting_recent_if_empty,
    normalize_to_utc,
    reconcile_recent_meetings,
    utc_now,
)
from ..realtime.connection_manager import manager

router = APIRouter()


@router.get("/meetings", response_model=list[MeetingOut])
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


@router.post("/meetings/instant", response_model=InstantMeetingResponse, status_code=201)
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


@router.post("/meetings/scheduled", response_model=MeetingOut, status_code=201)
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


@router.get("/meetings/{meeting_id}", response_model=MeetingOut)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)) -> Meeting:
    return get_meeting_or_404(db, meeting_id)


@router.post("/meetings/{meeting_id}/join", response_model=JoinMeetingResponse)
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


@router.delete(
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


@router.post(
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
