from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Appointment(BaseModel):
    id: str
    patient_id: str
    provider_id: str
    scheduled_for: datetime
    status: str = "scheduled"
    notes: Optional[str] = None


class AppointmentCreate(BaseModel):
    patient_id: str
    provider_id: str
    scheduled_for: datetime
    notes: Optional[str] = None


class ScribePayload(BaseModel):
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


class BillingPayload(BaseModel):
    patient_id: str
    appointment_id: str
    summary: str
    insurance_card: Dict[str, Any] | None = None


class BillingResponse(BaseModel):
    job_id: str
    billing_codes: List[str]
    insurance_details: Dict[str, Any]
    created_at: datetime


class VisionPayload(BaseModel):
    patient_id: str
    order_id: str
    product_name: str
    preferred_contact: Dict[str, Any]


class VisionResponse(BaseModel):
    job_id: str
    notification_channel: str
    message_preview: str
    created_at: datetime


class CarePlanTask(BaseModel):
    description: str
    due_in_days: int


class CarePlanPayload(BaseModel):
    patient_id: str
    care_plan_id: str
    tasks: List[CarePlanTask]


class CarePlanResponse(BaseModel):
    job_id: str
    scheduled_tasks: List[Dict[str, Any]]
    created_at: datetime
