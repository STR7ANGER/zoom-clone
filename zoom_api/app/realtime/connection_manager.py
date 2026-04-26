from __future__ import annotations

from typing import Any

from fastapi import WebSocket


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
