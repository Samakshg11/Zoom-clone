import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from utils import normalize_meeting_code, format_meeting_code, validate_meeting_code_format

def test_api_flow():
    with TestClient(app) as client:
        print("--- 1. Testing Root ---")
        res = client.get("/")
        assert res.status_code == 200
        print("Root response:", res.json())

        print("\n--- 2. Testing Health Check ---")
        res = client.get("/api/health")
        assert res.status_code == 200
        health = res.json()
        assert health["status"] == "healthy"
        assert health["database"] == "connected"
        assert "timestamp" in health
        assert health["version"] == "1.0.0"
        print("Health check passed:", health["status"], "| DB:", health["database"])

        print("\n--- 3. Testing Get Upcoming Meetings ---")
        res = client.get("/api/meetings/upcoming")
        assert res.status_code == 200
        upcoming = res.json()
        print(f"Found {len(upcoming)} upcoming meetings:")
        for m in upcoming:
            print(f"  - [{m['meeting_code']}] {m['title']} ({m['status']})")

        print("\n--- 4. Testing Get Recent Meetings ---")
        res = client.get("/api/meetings/recent")
        assert res.status_code == 200
        recent = res.json()
        print(f"Found {len(recent)} recent meetings:")
        for m in recent:
            print(f"  - [{m['meeting_code']}] {m['title']} ({m['status']})")

        print("\n--- 5. Testing Pagination: limit=1 offset=0 on recent ---")
        res = client.get("/api/meetings/recent?limit=1&offset=0")
        assert res.status_code == 200
        paged = res.json()
        assert len(paged) <= 1
        print(f"Pagination returned {len(paged)} result(s) correctly.")

        print("\n--- 6. Testing Search Filter on recent meetings ---")
        res = client.get("/api/meetings/recent?search=Sprint")
        assert res.status_code == 200
        search_results = res.json()
        for m in search_results:
            assert "sprint" in m["title"].lower() or "sprint" in m["meeting_code"].lower()
        print(f"Search filter returned {len(search_results)} result(s) for 'Sprint'.")

        print("\n--- 7. Testing Create Instant Meeting ---")
        res = client.post("/api/meetings/instant", json={"title": "Test Quick Huddle"})
        assert res.status_code == 201
        instant_m = res.json()
        assert instant_m["type"] == "instant"
        assert instant_m["status"] == "live"
        print("Instant meeting created:", instant_m["meeting_code"], instant_m["title"])

        print("\n--- 8. Testing Instant Meeting with Empty Title Defaults ---")
        res = client.post("/api/meetings/instant", json={"title": "  "})
        assert res.status_code == 201
        empty_title_m = res.json()
        assert empty_title_m["title"] == "Instant Meeting"
        print("Empty title defaulted to:", empty_title_m["title"])

        print("\n--- 9. Testing Create Scheduled Meeting ---")
        res = client.post("/api/meetings/schedule", json={
            "title": "Design System Q3 Review",
            "description": "Aligning component library tokens.",
            "scheduled_time": "2026-08-15T14:00:00Z",
            "duration_mins": 45
        })
        assert res.status_code == 201
        sched_m = res.json()
        print("Scheduled meeting created:", sched_m["meeting_code"], sched_m["title"])

        print("\n--- 10. Testing Scheduled Meeting Validation: Empty Title ---")
        res = client.post("/api/meetings/schedule", json={
            "title": "",
            "scheduled_time": "2026-09-01T10:00:00Z",
            "duration_mins": 30
        })
        assert res.status_code == 422
        print("Correctly rejected empty title with 422 Unprocessable Entity.")

        print("\n--- 11. Testing Scheduled Meeting Validation: Excessive Duration ---")
        res = client.post("/api/meetings/schedule", json={
            "title": "Overlong Meeting",
            "scheduled_time": "2026-09-01T10:00:00Z",
            "duration_mins": 2000
        })
        assert res.status_code == 422
        print("Correctly rejected duration > 1440 minutes with 422.")

        print("\n--- 12. Testing Get Details by Code ---")
        code = sched_m["meeting_code"]
        res = client.get(f"/api/meetings/{code}")
        assert res.status_code == 200
        print("Fetched meeting details successfully for code:", code)

        print("\n--- 13. Testing Code Normalization Lookup ---")
        no_dash_code = code.replace("-", "")
        res = client.get(f"/api/meetings/{no_dash_code}")
        assert res.status_code == 200
        print(f"Normalized code lookup worked: '{no_dash_code}' resolved to meeting '{sched_m['title']}'")

        print("\n--- 14. Testing Join Meeting ---")
        res = client.post(f"/api/meetings/{code}/join", json={"display_name": "Antigravity Evaluator"})
        assert res.status_code == 200
        join_res = res.json()
        print("Joined meeting result:", join_res["message"], "Participant ID:", join_res["participant"]["id"])

        print("\n--- 15. Testing End Meeting ---")
        res = client.post(f"/api/meetings/{code}/end")
        assert res.status_code == 200
        ended_m = res.json()
        assert ended_m["status"] == "ended"
        print("Successfully ended meeting, status is now:", ended_m["status"])

        print("\n--- 16. Testing Join Ended Meeting (400) ---")
        res = client.post(f"/api/meetings/{code}/join", json={"display_name": "Late Joiner"})
        assert res.status_code == 400
        print("Correctly rejected joining ended meeting with 400 Bad Request.")

        print("\n--- 17. Testing Invalid Meeting Code (404) ---")
        res = client.get("/api/meetings/invalid-code-999")
        assert res.status_code == 404
        print("404 handled correctly for invalid code.")

        print("\n--- 18. Testing Cancel (DELETE) Meeting ---")
        res = client.post("/api/meetings/instant", json={"title": "Meeting to Cancel"})
        assert res.status_code == 201
        cancel_code = res.json()["meeting_code"]
        res = client.delete(f"/api/meetings/{cancel_code}")
        assert res.status_code == 200
        res = client.get(f"/api/meetings/{cancel_code}")
        assert res.status_code == 404
        print(f"Meeting '{cancel_code}' successfully cancelled and verified deleted.")

        print("\n--- 19. Utils Unit Tests ---")
        assert normalize_meeting_code("123-456-789") == "123456789"
        assert normalize_meeting_code("  abc def  ") == "abcdef"
        assert format_meeting_code("123456789") == "123-456-789"
        assert validate_meeting_code_format("123456789") is True
        assert validate_meeting_code_format("ab") is False
        print("Utils: normalize, format, validate all passed.")

        print("\n\u2705 ALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api_flow()
