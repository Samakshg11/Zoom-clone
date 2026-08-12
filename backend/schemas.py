from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)

class ParticipantResponse(BaseModel):
    id: int
    meeting_id: int
    display_name: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InstantMeetingCreate(BaseModel):
    title: Optional[str] = "Instant Meeting"

    @field_validator("title")

    @classmethod
    def validate_title(cls, v: Optional[str]) -> str:
        if v is None or not v.strip():
            return "Instant Meeting"
        return v.strip()

class ScheduledMeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_time: datetime
    duration_mins: Optional[int] = 30

    @field_validator("title")

    @classmethod
    def validate_title(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Meeting title cannot be empty.")
        return cleaned

    @field_validator("duration_mins")

    @classmethod
    def validate_duration(cls, v: Optional[int]) -> int:
        if v is None or v <= 0:
            return 30
        if v > 1440:
            raise ValueError("Duration cannot exceed 24 hours (1440 minutes).")
        return v

class JoinMeetingRequest(BaseModel):
    display_name: str

    @field_validator("display_name")

    @classmethod
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Display name cannot be empty.")
        return cleaned

class MeetingResponse(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: Optional[str] = None
    host_id: int
    type: str
    scheduled_time: Optional[datetime] = None
    duration_mins: Optional[int] = None
    invite_link: str
    status: str
    created_at: datetime
    participants: List[ParticipantResponse] = []

    model_config = ConfigDict(from_attributes=True)

class JoinResponse(BaseModel):
    message: str
    participant: ParticipantResponse
    meeting: MeetingResponse
