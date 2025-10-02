from datetime import datetime
from typing import Any, Dict, List
import uuid

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="Cordia Scribe Bot",
    description="Summarises patient visits and stores structured highlights.",
    version="0.1.0",
)


class VisitNote(BaseModel):
    patient_id: str
    appointment_id: str
    transcript: str
    provider_id: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ScribeResponse(BaseModel):
    job_id: str
    summary: str
    highlights: List[str]
    created_at: datetime


RECENT_JOBS: Dict[str, ScribeResponse] = {}
START_TIME = datetime.utcnow()


def _generate_summary(transcript: str) -> Dict[str, Any]:
    """Placeholder summarisation logic until LLM integration is wired."""
    sentences = [s.strip() for s in transcript.split(".") if s.strip()]
    summary = " ".join(sentences[:2]) if sentences else "No transcript provided."
    highlights = sentences[:5]
    return {"summary": summary, "highlights": highlights}


@app.post("/run", response_model=ScribeResponse)
def run_scribe(visit: VisitNote) -> ScribeResponse:
    job_id = str(uuid.uuid4())
    generated = _generate_summary(visit.transcript)
    response = ScribeResponse(
        job_id=job_id,
        summary=generated["summary"],
        highlights=generated["highlights"],
        created_at=datetime.utcnow(),
    )
    RECENT_JOBS[job_id] = response
    return response


@app.get("/status")
def status() -> Dict[str, Any]:
    return {
        "service": "cordia-scribe-bot",
        "uptime_seconds": (datetime.utcnow() - START_TIME).total_seconds(),
        "jobs_processed": len(RECENT_JOBS),
    }
