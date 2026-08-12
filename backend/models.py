from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="Demo Host")
    email = Column(String, nullable=False, default="demo@zoomclone.com")

    meetings = relationship("Meeting", back_populates="host")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # 'instant' or 'scheduled'
    scheduled_time = Column(DateTime, nullable=True)
    duration_mins = Column(Integer, nullable=True, default=30)
    invite_link = Column(String, nullable=False)
    status = Column(String, nullable=False, default="upcoming")  # 'upcoming', 'live', 'ended'
    created_at = Column(DateTime, default=utcnow)

    host = relationship("User", back_populates="meetings")
    participants = relationship("Participant", back_populates="meeting", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, default=utcnow)

    meeting = relationship("Meeting", back_populates="participants")
