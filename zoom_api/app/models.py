from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


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
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    participants: Mapped[list["Participant"]] = relationship(
        back_populates="meeting",
        cascade="all, delete-orphan",
    )


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
    role: Mapped[str] = mapped_column(String(24), default="participant")
    muted: Mapped[bool] = mapped_column(Boolean, default=False)
    camera_on: Mapped[bool] = mapped_column(Boolean, default=True)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    left_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    meeting: Mapped[Meeting] = relationship(back_populates="participants")

