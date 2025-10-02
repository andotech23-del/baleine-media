from datetime import datetime
from typing import Any, Dict, List
import uuid

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="Cordia Billing Bot",
    description="Extracts billing codes and insurance details from visit notes.",
    version="0.1.0",
)


class BillingRequest(BaseModel):
    patient_id: str
    appointment_id: str
    summary: str
    insurance_card: Dict[str, Any] | None = None


class BillingResponse(BaseModel):
    job_id: str
    billing_codes: List[str]
    insurance_details: Dict[str, Any]
    created_at: datetime


RECENT_JOBS: Dict[str, BillingResponse] = {}
START_TIME = datetime.utcnow()


@app.post("/run", response_model=BillingResponse)
def run_billing(payload: BillingRequest) -> BillingResponse:
    if not payload.summary:
        raise HTTPException(status_code=400, detail="Summary is required for billing analysis")

    job_id = str(uuid.uuid4())
    billing_codes = ["99213", "G2211"]  # placeholder CPT codes
    insurance_details = payload.insurance_card or {"status": "verification_pending"}
    response = BillingResponse(
        job_id=job_id,
        billing_codes=billing_codes,
        insurance_details=insurance_details,
        created_at=datetime.utcnow(),
    )
    RECENT_JOBS[job_id] = response
    return response


@app.get("/status")
def status() -> Dict[str, Any]:
    return {
        "service": "cordia-billing-bot",
        "uptime_seconds": (datetime.utcnow() - START_TIME).total_seconds(),
        "jobs_processed": len(RECENT_JOBS),
    }
