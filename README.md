# Zoom Clone — Fullstack Web Application

A fullstack video-conferencing web application cloning Zoom's core meeting workflows, built as a Scaler SDE Fullstack Assignment.

---

## ✨ Features

- **Instant Meetings** — Generate a unique 9-digit meeting code and start a live room immediately
- **Join Meetings** — Enter via meeting ID or paste a full invite link, with display name validation
- **Schedule Meetings** — Set title, description, date/time, and duration; appears in Upcoming Meetings
- **Upcoming Meetings** — Dashboard card list of all scheduled future meetings
- **Recent Meetings** — Dashboard card list of all ended meetings with "Join Again" action
- **Meeting Room UI Shell** — Zoom-style room with participant tiles, audio visualizer, mute/video controls, participants drawer, and live chat
- **Meeting Lifecycle** — `upcoming → live → ended` transitions backed by the database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router, TypeScript, Tailwind CSS) |
| Backend | FastAPI (Python 3.14) |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite (`zoom_clone.db`) |
| Icons | Lucide React |

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `name` | TEXT | Default: "Demo Host" |
| `email` | TEXT | Default: "demo@zoomclone.com" |

### `meetings`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `meeting_code` | TEXT UNIQUE | Auto-generated `xxx-xxx-xxx` |
| `title` | TEXT | |
| `description` | TEXT | Nullable |
| `host_id` | INTEGER FK | → `users.id` |
| `type` | TEXT | `'instant'` or `'scheduled'` |
| `scheduled_time` | DATETIME | Nullable for instant meetings |
| `duration_mins` | INTEGER | Nullable |
| `invite_link` | TEXT | e.g. `/join/982-415-307` |
| `status` | TEXT | `'upcoming'`, `'live'`, or `'ended'` |
| `created_at` | DATETIME | UTC |

### `participants`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `meeting_id` | INTEGER FK | → `meetings.id` |
| `display_name` | TEXT | Entered by user at join time |
| `joined_at` | DATETIME | UTC |

---

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/meetings/instant` | Create instant meeting (status: `live`) |
| `POST` | `/api/meetings/schedule` | Create scheduled meeting (status: `upcoming`) |
| `GET` | `/api/meetings/upcoming` | List scheduled upcoming meetings |
| `GET` | `/api/meetings/recent` | List ended/past meetings |
| `GET` | `/api/meetings/{code}` | Validate meeting code & get details |
| `POST` | `/api/meetings/{code}/join` | Add participant, transition status to `live` |
| `POST` | `/api/meetings/{code}/end` | Mark meeting as `ended` |
| `DELETE` | `/api/meetings/{code}` | Cancel and delete a meeting |

Interactive API docs available at: **`http://localhost:8000/docs`**

---

## 🚀 Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The backend will:
- Automatically create `zoom_clone.db` on first run
- Idempotently seed 1 default user and 4 sample meetings (2 upcoming, 2 recent)
- Expose API docs at `http://localhost:8000/docs`

### 2. Frontend Setup

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start the Next.js development server
npm run dev
```

Frontend will be available at: **`http://localhost:3000`**

---

## 🔧 Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update this to your deployed backend URL.

### Backend (optional)

```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
PORT=8000
```

See `.env.example` for a full template.

---

## 🧪 Running Backend Tests

```bash
cd backend
source venv/bin/activate
python test_api.py
```

This verifies all 9 API endpoint cases including meeting creation, join, end lifecycle, and 404 handling.

---

## 🌐 Deployment

### Frontend → Vercel

1. Push the repository to GitHub.
2. Import the `frontend/` directory in [Vercel](https://vercel.com).
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.com/api`

### Backend → Render / Railway

1. Deploy the `backend/` directory.
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Set `ALLOWED_ORIGINS` to your Vercel frontend URL.

---

## 👤 Default User (No Authentication)

Authentication is **intentionally not implemented** because the assignment specification explicitly permits assuming a single default logged-in user.

On startup, the backend seeds a default user:
- **Name**: Demo Host
- **Email**: demo@zoomclone.com

All meetings are created on behalf of this default user.

---

## ⚠️ Known Limitations

- **No real WebRTC video/audio**: The meeting room renders a realistic UI shell with placeholder participant tiles and avatar initials. Actual media streaming (WebRTC) is out of scope per the assignment requirements.
- **No authentication/signup**: Single default user mode as specified.
- **SQLite**: Uses SQLite for simplicity. For production at scale, PostgreSQL would be recommended.
- **Local participant state**: Display names are stored in `localStorage` per meeting code, not in a session cookie or JWT.
