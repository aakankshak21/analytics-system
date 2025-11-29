from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="Analytics Metrics API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyticsInput(BaseModel):
    user_id: str
    event_name: str
    timestamp: datetime
    views: int = 0
    clicks: int = 0
    time_spent_seconds: float = 0


class AnalyticsOutput(AnalyticsInput):
    engagement_score: float
    processed_at: datetime


def compute_engagement_score(r: AnalyticsInput) -> float:
    return r.views + (r.clicks * 3) + (r.time_spent_seconds * 0.1)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/compute-metrics", response_model=List[AnalyticsOutput])
def compute_metrics(payload: List[AnalyticsInput]):
    if not payload:
        raise HTTPException(status_code=400, detail="Input array cannot be empty")

    processed_at = datetime.now(timezone.utc)

    output = []
    for item in payload:
        score = compute_engagement_score(item)
        output.append(
            AnalyticsOutput(
                **item.model_dump(),
                engagement_score=round(score, 3),
                processed_at=processed_at,
            )
        )
    return output
