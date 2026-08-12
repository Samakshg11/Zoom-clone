from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

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

class ScheduledMeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_time: datetime
    duration_mins: Optional[int] = 30

class JoinMeetingRequest(BaseModel):
    display_name: str

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
