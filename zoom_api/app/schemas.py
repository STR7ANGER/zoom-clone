from datetime import datetime

from pydantic import BaseModel, Field


class ParticipantOut(BaseModel):
    participant_id: str
    meeting_id: str
    display_name: str
    role: str
    muted: bool
    camera_on: bool
    joined_at: datetime
    left_at: datetime | None = None

    model_config = {"from_attributes": True}


class MeetingOut(BaseModel):
    meeting_id: str
    title: str
    description: str
    meeting_type: str
    status: str
    starts_at: datetime
    duration_minutes: int
    invite_link: str
    host_name: str
    created_at: datetime
    participants: list[ParticipantOut] = []

    model_config = {"from_attributes": True}


class InstantMeetingCreate(BaseModel):
    host_display_name: str = Field(default="Demo User", min_length=1, max_length=120)


class ScheduledMeetingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = ""
    starts_at: datetime
    duration_minutes: int = Field(default=40, ge=1, le=480)
    host_name: str = Field(default="Demo User", min_length=1, max_length=120)


class JoinMeetingRequest(BaseModel):
    display_name: str = Field(min_length=1, max_length=120)


class ParticipantPatch(BaseModel):
    muted: bool | None = None
    camera_on: bool | None = None
    left: bool | None = None


class JoinMeetingResponse(BaseModel):
    meeting: MeetingOut
    participant: ParticipantOut


class InstantMeetingResponse(BaseModel):
    meeting: MeetingOut
    participant: ParticipantOut

