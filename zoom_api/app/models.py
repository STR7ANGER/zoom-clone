from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    meeting_id: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160), default="Zoom Meeting")
    description: Mapped[str] = mapped_column(Text, default="")
    meeting_type: Mapped[str] = mapped_column(String(24), default="instant")
    status: Mapped[str] = mapped_column(String(24), default="upcoming")
    starts_at: Mapped[datetime] = mapped_column(DateTime)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=40)
    invite_link: Mapped[str] = mapped_column(String(255))
    host_name: Mapped[str] = mapped_column(String(120), default="Demo User")
    host_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    participants: Mapped[list["Participant"]] = relationship(
        back_populates="meeting",
        cascade="all, delete-orphan",
    )
    host_user: Mapped["User | None"] = relationship(back_populates="meetings")
    invited_users: Mapped[list["MeetingInvite"]] = relationship(
        back_populates="meeting",
        cascade="all, delete-orphan",
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    auth_provider: Mapped[str] = mapped_column(String(32), default="email")
    google_sub: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    meetings: Mapped[list[Meeting]] = relationship(back_populates="host_user")
    meeting_invites: Mapped[list["MeetingInvite"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class MeetingInvite(Base):
    __tablename__ = "meeting_invites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    meeting_id: Mapped[str] = mapped_column(
        String(16),
        ForeignKey("meetings.meeting_id", ondelete="CASCADE"),
        index=True,
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    meeting: Mapped[Meeting] = relationship(back_populates="invited_users")
    user: Mapped[User] = relationship(back_populates="meeting_invites")


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    participant_id: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    meeting_id: Mapped[str] = mapped_column(
        String(16),
        ForeignKey("meetings.meeting_id", ondelete="CASCADE"),
        index=True,
    )
    display_name: Mapped[str] = mapped_column(String(120))
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(String(24), default="participant")
    muted: Mapped[bool] = mapped_column(Boolean, default=False)
    camera_on: Mapped[bool] = mapped_column(Boolean, default=True)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    left_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    meeting: Mapped[Meeting] = relationship(back_populates="participants")
