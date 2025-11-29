# Analytics System
Overview:
A full end-to-end analytics processing system with FastAPI backend and Next.js frontend.

Features:
- Backend: FastAPI with metrics computation, validation, timestamping.
- Frontend: Next.js dashboard with JSON input, API call, and result table.

Prerequisites:
Ensure you have:
Python 3.8+ installed
pip installed
Node.js 20+
npm 10+

Project Structure:
analytics-system/
  backend/
    app/main.py
    requirements.txt
  frontend/
    app/analytics/page.tsx
    package.json
  .gitignore
  README.md

Backend Setup:
1. cd backend
2. sudo apt install python3.8-venv
3. python3 -m venv venv
4. source venv/bin/activate # for Linux/Mac
   #OR venv\Scripts\activate    # for Windows
5. pip install -r requirements.txt
6. uvicorn app.main:app --reload --port 8000

Frontend Setup:
1. cd frontend
2. npm install
3. Create .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000
4. npm run dev

API:
POST /api/compute-metrics
Input: Array of analytics JSON objects.
Output: Engagement score + processed_at timestamp.

Backend runs at:
http://localhost:8000
Health check: http://localhost:8000/health

Frontend runs at:
http://localhost:3000/analytics

API Docs (Swagger UI) runs at:
http://localhost:8000/docs

Usage:
1. Start backend.
2. Start frontend.
3. Open http://localhost:3000/analytics.
4. Enter JSON → Compute Metrics.

#################################################################################

Example Input : 
[
    {
      "user_id": "user_1",
      "event_name": "page_view",
      "timestamp": "2025-01-01T10:00:00Z",
      "views": 5,
      "clicks": 2,
      "time_spent_seconds": 120
    },
    {
      "user_id": "user_2",
      "event_name": "signup",
      "timestamp": "2025-01-01T10:05:00Z",
      "views": 1,
      "clicks": 1,
      "time_spent_seconds": 30
    },
    {
      "user_id": "user_3",
      "event_name": "purchase",
      "timestamp": "2025-01-01T10:10:00Z",
      "views": 3,
      "clicks": 4,
      "time_spent_seconds": 300
    },
    {
      "user_id": "user_4",
      "event_name": "page_view",
      "timestamp": "2025-01-01T10:15:00Z",
      "views": 2,
      "clicks": 0,
      "time_spent_seconds": 60
    },
    {
      "user_id": "user_5",
      "event_name": "click",
      "timestamp": "2025-01-01T10:20:00Z",
      "views": 1,
      "clicks": 5,
      "time_spent_seconds": 90
    },
    {
      "user_id": "user_6",
      "event_name": "page_view",
      "timestamp": "2025-01-01T10:25:00Z",
      "views": 8,
      "clicks": 1,
      "time_spent_seconds": 45
    },
    {
      "user_id": "user_7",
      "event_name": "signup",
      "timestamp": "2025-01-01T10:30:00Z",
      "views": 2,
      "clicks": 3,
      "time_spent_seconds": 180
    },
    {
      "user_id": "user_8",
      "event_name": "purchase",
      "timestamp": "2025-01-01T10:35:00Z",
      "views": 4,
      "clicks": 6,
      "time_spent_seconds": 600
    },
    {
      "user_id": "user_9",
      "event_name": "page_view",
      "timestamp": "2025-01-01T10:40:00Z",
      "views": 1,
      "clicks": 0,
      "time_spent_seconds": 15
    },
    {
      "user_id": "user_10",
      "event_name": "click",
      "timestamp": "2025-01-01T10:45:00Z",
      "views": 3,
      "clicks": 7,
      "time_spent_seconds": 240
    },
    {
      "user_id": "user_11",
      "event_name": "signup",
      "timestamp": "2025-01-01T10:50:00Z",
      "views": 1,
      "clicks": 2,
      "time_spent_seconds": 75
    },
    {
      "user_id": "user_12",
      "event_name": "purchase",
      "timestamp": "2025-01-01T10:55:00Z",
      "views": 6,
      "clicks": 8,
      "time_spent_seconds": 90
    }
  ]

Engagement Score Computation : 
Formula used - engagement_score = views * 1 + clicks * 3 + time_spent_seconds * 0.1
Each input has clear weighting: clicks matter most (×3), time contributes steadily (×0.1), views as baseline.

How It Works:
1. User pastes JSON analytics data in the frontend.
2. Frontend sends POST request to FastAPI.
3. FastAPI validates input and computes engagement score.
4. Response is displayed in a table with timestamps.
