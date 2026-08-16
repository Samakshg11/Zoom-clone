import os
from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
from seed import seed_db, generate_meeting_code

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed initial data (idempotent)
    db = next(get_db())
    try:
        seed_db(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Zoom Clone API",
    description="FastAPI Backend for Zoom Clone Fullstack Web Application",
    version="1.0.0",
    lifespan=lifespan
)

# Dynamic CORS Configuration
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def normalize_code(code: str) -> str:
    return code.strip().replace(" ", "").replace("-", "")

def find_meeting_by_code(db: Session, raw_code: str) -> Optional[models.Meeting]:
    meeting = db.query(models.Meeting).filter(models.Meeting.meeting_code == raw_code).first()
    if meeting:
        return meeting
    
    normalized_input = normalize_code(raw_code)
    all_meetings = db.query(models.Meeting).all()
    for m in all_meetings:
        if normalize_code(m.meeting_code) == normalized_input:
            return m
    return None

from sqlalchemy import text

@app.get("/")
def read_root():
    return {"message": "Zoom Clone API Server is running."}

@app.get("/api/health", response_model=schemas.HealthStatusResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc),
        "version": "1.0.0"
    }

@app.post("/api/meetings/instant", response_model=schemas.MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_instant_meeting(
    payload: Optional[schemas.InstantMeetingCreate] = None,
    db: Session = Depends(get_db)
):
    code = generate_meeting_code()
    while db.query(models.Meeting).filter(models.Meeting.meeting_code == code).first():
        code = generate_meeting_code()

    title = payload.title if (payload and payload.title) else "Instant Meeting"
    
    meeting = models.Meeting(
        meeting_code=code,
        title=title,
        description="Instant video meeting",
        host_id=1,  # Default seeded user
        type="instant",
        scheduled_time=None,
        duration_mins=45,
        invite_link=f"/join/{code}",
        status="live",
        created_at=datetime.now(timezone.utc)
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

@app.post("/api/meetings/schedule", response_model=schemas.MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_scheduled_meeting(
    payload: schemas.ScheduledMeetingCreate,
    db: Session = Depends(get_db)
):
    code = generate_meeting_code()
    while db.query(models.Meeting).filter(models.Meeting.meeting_code == code).first():
        code = generate_meeting_code()

    meeting = models.Meeting(
        meeting_code=code,
        title=payload.title,
        description=payload.description,
        host_id=1,  # Default seeded user
        type="scheduled",
        scheduled_time=payload.scheduled_time,
        duration_mins=payload.duration_mins or 30,
        invite_link=f"/join/{code}",
        status="upcoming",
        created_at=datetime.now(timezone.utc)
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

@app.get("/api/meetings/upcoming", response_model=List[schemas.MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    meetings = (
        db.query(models.Meeting)
        .filter(
            models.Meeting.type == "scheduled",
            models.Meeting.status == "upcoming",
            models.Meeting.scheduled_time >= now
        )
        .order_by(models.Meeting.scheduled_time.asc())
        .all()
    )
    return meetings

@app.get("/api/meetings/recent", response_model=List[schemas.MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    meetings = (
        db.query(models.Meeting)
        .filter(models.Meeting.status == "ended")
        .order_by(models.Meeting.created_at.desc())
        .all()
    )
    return meetings

@app.get("/api/meetings/{meeting_code}", response_model=schemas.MeetingResponse)
def get_meeting_details(meeting_code: str, db: Session = Depends(get_db)):
    meeting = find_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with code '{meeting_code}' was not found."
        )
    return meeting

@app.post("/api/meetings/{meeting_code}/join", response_model=schemas.JoinResponse)
def join_meeting(
    meeting_code: str,
    payload: schemas.JoinMeetingRequest,
    db: Session = Depends(get_db)
):
    meeting = find_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with code '{meeting_code}' was not found."
        )

    # Reject joining ended meetings
    if meeting.status == "ended":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This meeting has ended."
        )

    # Create participant entry
    participant = models.Participant(
        meeting_id=meeting.id,
        display_name=payload.display_name.strip(),
        joined_at=datetime.now(timezone.utc)
    )
    db.add(participant)
    
    # Transition upcoming -> live when participant joins
    if meeting.status == "upcoming":
        meeting.status = "live"
        db.add(meeting)

    db.commit()
    db.refresh(participant)
    db.refresh(meeting)

    return schemas.JoinResponse(
        message=f"Successfully joined meeting '{meeting.title}'",
        participant=participant,
        meeting=meeting
    )

@app.post("/api/meetings/{meeting_code}/end", response_model=schemas.MeetingResponse)
def end_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = find_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with code '{meeting_code}' was not found."
        )

    # Mark status as ended (idempotent)
    meeting.status = "ended"
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

@app.delete("/api/meetings/{meeting_code}", status_code=status.HTTP_200_OK)
def cancel_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = find_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with code '{meeting_code}' was not found."
        )

    db.delete(meeting)
    db.commit()
    return {"message": f"Meeting '{meeting_code}' successfully deleted."}
