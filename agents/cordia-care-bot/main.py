from datetime import datetime, timedelta
from typing import Any, Dict, List
import uuid

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Cordia Care Bot",
    description="Coordinates longitudinal care plans and nudges patients to stay on track.",
    version="0.1.0",
)


class CarePlanTask(BaseModel):
    description: str
    due_in_days: int


class CarePlanRequest(BaseModel):
    patient_id: str
    care_plan_id: str
    tasks: List[CarePlanTask]


class CarePlanResponse(BaseModel):
    job_id: str
    scheduled_tasks: List[Dict[str, Any]]
    created_at: datetime


RECENT_JOBS: Dict[str, CarePlanResponse] = {}
START_TIME = datetime.utcnow()


@app.post("/run", response_model=CarePlanResponse)
def run_care_plan(payload: CarePlanRequest) -> CarePlanResponse:
    now = datetime.utcnow()
    scheduled = [
        {
            "description": task.description,
            "due_date": (now + timedelta(days=task.due_in_days)).isoformat(),
            "status": "pending",
        }
        for task in payload.tasks
    ]
    response = CarePlanResponse(
        job_id=str(uuid.uuid4()),
        scheduled_tasks=scheduled,
        created_at=now,
    )
    RECENT_JOBS[response.job_id] = response
    return response


@app.get("/status")
def status() -> Dict[str, Any]:
    return {
        "service": "cordia-care-bot",
        "uptime_seconds": (datetime.utcnow() - START_TIME).total_seconds(),
        "jobs_processed": len(RECENT_JOBS),
    }
