import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

def test_api_flow():
    with TestClient(app) as client:
        print("--- 1. Testing Root ---")
        res = client.get("/")
        assert res.status_code == 200
        print("Root response:", res.json())

        print("\n--- 2. Testing Get Upcoming Meetings ---")
        res = client.get("/api/meetings/upcoming")
        assert res.status_code == 200
        upcoming = res.json()
        print(f"Found {len(upcoming)} upcoming meetings:")
        for m in upcoming:
            print(f"  - [{m['meeting_code']}] {m['title']} ({m['status']})")

        print("\n--- 3. Testing Get Recent Meetings ---")
        res = client.get("/api/meetings/recent")
        assert res.status_code == 200
        recent = res.json()
        print(f"Found {len(recent)} recent meetings:")
        for m in recent:
            print(f"  - [{m['meeting_code']}] {m['title']} ({m['status']})")

        print("\n--- 4. Testing Create Instant Meeting ---")
        res = client.post("/api/meetings/instant", json={"title": "Test Quick Huddle"})
        assert res.status_code == 201
        instant_m = res.json()
        print("Instant meeting created:", instant_m["meeting_code"], instant_m["title"])

        print("\n--- 5. Testing Create Scheduled Meeting ---")
        res = client.post("/api/meetings/schedule", json={
            "title": "Design System Q3 Review",
            "description": "Aligning component library tokens.",
            "scheduled_time": "2026-08-15T14:00:00Z",
            "duration_mins": 45
        })
        assert res.status_code == 201
        sched_m = res.json()
        print("Scheduled meeting created:", sched_m["meeting_code"], sched_m["title"])

        print("\n--- 6. Testing Get Details by Code ---")
        code = sched_m["meeting_code"]
        res = client.get(f"/api/meetings/{code}")
        assert res.status_code == 200
        print("Fetched meeting details successfully for code:", code)

        print("\n--- 7. Testing Join Meeting ---")
        res = client.post(f"/api/meetings/{code}/join", json={"display_name": "Antigravity Evaluator"})
        assert res.status_code == 200
        join_res = res.json()
        print("Joined meeting result:", join_res["message"], "Participant ID:", join_res["participant"]["id"])

        print("\n--- 8. Testing End Meeting ---")
        res = client.post(f"/api/meetings/{code}/end")
        assert res.status_code == 200
        ended_m = res.json()
        assert ended_m["status"] == "ended"
        print("Successfully ended meeting, status is now:", ended_m["status"])

        print("\n--- 9. Testing Invalid Meeting Code (404) ---")
        res = client.get("/api/meetings/invalid-code-999")
        assert res.status_code == 404
        print("404 handled correctly for invalid code.")

        print("\n✅ ALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api_flow()
