import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models import User, Meeting, Participant

def generate_meeting_code() -> str:
    part1 = f"{random.randint(100, 999)}"
    part2 = f"{random.randint(100, 999)}"
    part3 = f"{random.randint(100, 999)}"
    return f"{part1}-{part2}-{part3}"

def seed_db(db: Session):
    # Ensure default user exists
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        user = User(id=1, name="Demo Host", email="demo@zoomclone.com")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check if meetings already seeded
    existing_count = db.query(Meeting).count()
    if existing_count > 0:
        return

    now = datetime.now(timezone.utc)

    # Seed Upcoming Meeting 1
    code1 = generate_meeting_code()
    m1 = Meeting(
        meeting_code=code1,
        title="Weekly Sync with Design Team",
        description="Reviewing UI components and brand palette for upcoming launch.",
        host_id=user.id,
        type="scheduled",
        scheduled_time=now + timedelta(hours=2, minutes=30),
        duration_mins=45,
        invite_link=f"/join/{code1}",
        status="upcoming",
        created_at=now - timedelta(days=1)
    )

    # Seed Upcoming Meeting 2
    code2 = generate_meeting_code()
    m2 = Meeting(
        meeting_code=code2,
        title="Product Architecture Review",
        description="Deep dive into API contracts and microservice scalability.",
        host_id=user.id,
        type="scheduled",
        scheduled_time=now + timedelta(days=1, hours=4),
        duration_mins=60,
        invite_link=f"/join/{code2}",
        status="upcoming",
        created_at=now - timedelta(hours=5)
    )

    # Seed Recent Meeting 1 (Ended)
    code3 = generate_meeting_code()
    m3 = Meeting(
        meeting_code=code3,
        title="Sprint Retrospective",
        description="Reviewing team velocity, completed tasks, and action items.",
        host_id=user.id,
        type="scheduled",
        scheduled_time=now - timedelta(days=1, hours=3),
        duration_mins=30,
        invite_link=f"/join/{code3}",
        status="ended",
        created_at=now - timedelta(days=2)
    )

    # Seed Recent Meeting 2 (Ended)
    code4 = generate_meeting_code()
    m4 = Meeting(
        meeting_code=code4,
        title="Scaler SDE Fullstack Discussion",
        description="Project walkthrough and technical feedback session.",
        host_id=user.id,
        type="instant",
        scheduled_time=None,
        duration_mins=60,
        invite_link=f"/join/{code4}",
        status="ended",
        created_at=now - timedelta(days=3)
    )

    db.add_all([m1, m2, m3, m4])
    db.commit()

    # Seed sample participants for ended meetings
    p1 = Participant(meeting_id=m3.id, display_name="Alex Rivera", joined_at=now - timedelta(days=1, hours=3))
    p2 = Participant(meeting_id=m3.id, display_name="Sarah Chen", joined_at=now - timedelta(days=1, hours=3))
    p3 = Participant(meeting_id=m4.id, display_name="Rahul Sharma", joined_at=now - timedelta(days=3))
    db.add_all([p1, p2, p3])
    db.commit()
    print("Database successfully seeded with default user and sample meetings.")
