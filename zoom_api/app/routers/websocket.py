from __future__ import annotations

import json

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from ..database import SessionLocal
from ..models import Participant
from ..schemas import ParticipantOut
from ..services.meetings import mark_meeting_recent_if_empty, utc_now
from ..realtime.connection_manager import manager

router = APIRouter()


@router.websocket("/ws/meetings/{meeting_id}")
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
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
                continue
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
