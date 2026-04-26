from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant
from ..schemas import ParticipantOut, ParticipantPatch
from ..services.meetings import mark_meeting_recent_if_empty, utc_now
from ..realtime.connection_manager import manager

router = APIRouter()


@router.patch("/participants/{participant_id}", response_model=ParticipantOut)
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
