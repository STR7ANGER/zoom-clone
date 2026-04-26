from datetime import datetime, timezone

from pydantic import BaseModel, Field, field_serializer


def as_utc_iso(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    else:
        value = value.astimezone(timezone.utc)
    return value.isoformat()


class ParticipantOut(BaseModel):
    participant_id: str
    meeting_id: str
    display_name: str
    avatar_url: str | None = None
    role: str
    muted: bool
    camera_on: bool
    joined_at: datetime
    left_at: datetime | None = None

    @field_serializer("joined_at", "left_at")
    def serialize_participant_datetime(self, value: datetime | None) -> str | None:
        return as_utc_iso(value)

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
    host_user_id: int | None = None
    created_at: datetime
    participants: list[ParticipantOut] = []

    @field_serializer("starts_at", "created_at")
    def serialize_meeting_datetime(self, value: datetime) -> str | None:
        return as_utc_iso(value)

    model_config = {"from_attributes": True}


class InstantMeetingCreate(BaseModel):
    host_display_name: str = Field(default="Demo User", min_length=1, max_length=120)


class ScheduledMeetingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = ""
    starts_at: datetime
    duration_minutes: int = Field(default=40, ge=1, le=480)
    host_name: str = Field(default="Demo User", min_length=1, max_length=120)
    invitees: list[str] = Field(default_factory=list, max_length=50)


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


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    avatar_url: str | None = None
    auth_provider: str

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class SignupRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)
