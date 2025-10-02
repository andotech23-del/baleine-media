from datetime import datetime
from typing import Any, Dict
import uuid

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Cordia Vision Bot",
    description="Notifies patients when optical products are ready for pickup.",
    version="0.1.0",
)


class VisionRequest(BaseModel):
    patient_id: str
    order_id: str
    product_name: str
    preferred_contact: Dict[str, Any]


class VisionResponse(BaseModel):
    job_id: str
    notification_channel: str
    message_preview: str
    created_at: datetime


RECENT_JOBS: Dict[str, VisionResponse] = {}
START_TIME = datetime.utcnow()


@app.post("/run", response_model=VisionResponse)
def run_vision(payload: VisionRequest) -> VisionResponse:
    job_id = str(uuid.uuid4())
    channel = payload.preferred_contact.get("channel", "sms")
    message = (
        f"Hi! Your {payload.product_name} is ready for pickup."
        " Reply YES to confirm scheduling."
    )
    response = VisionResponse(
        job_id=job_id,
        notification_channel=channel,
        message_preview=message,
        created_at=datetime.utcnow(),
    )
    RECENT_JOBS[job_id] = response
    return response


@app.get("/status")
def status() -> Dict[str, Any]:
    return {
        "service": "cordia-vision-bot",
        "uptime_seconds": (datetime.utcnow() - START_TIME).total_seconds(),
        "jobs_processed": len(RECENT_JOBS),
    }
