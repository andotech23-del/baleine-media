from __future__ import annotations

import os
from datetime import datetime
from typing import List

from google.cloud import firestore

from ..schemas import (
    Appointment,
    AppointmentCreate,
    BillingResponse,
    CarePlanResponse,
    VisionResponse,
)

_firestore_client: firestore.Client | None = None


def get_client() -> firestore.Client:
    global _firestore_client
    if _firestore_client is None:
        project_id = os.getenv("GCP_PROJECT", "cordia-dev")
        _firestore_client = firestore.Client(project=project_id)
    return _firestore_client


def list_appointments() -> List[Appointment]:
    client = get_client()
    docs = client.collection("appointments").limit(50).stream()
    appointments: List[Appointment] = []
    for doc in docs:
        payload = doc.to_dict()
        payload["id"] = doc.id
        appointments.append(Appointment(**payload))
    return appointments


def create_appointment(payload: AppointmentCreate) -> Appointment:
    client = get_client()
    data = payload.dict()
    data["status"] = "scheduled"
    ref = client.collection("appointments").document()
    ref.set(data)
    data["id"] = ref.id
    return Appointment(**data)


def save_billing(response: BillingResponse) -> None:
    client = get_client()
    client.collection("billing").document(response.job_id).set(
        response.dict()
    )


def save_vision_notification(response: VisionResponse) -> None:
    client = get_client()
    client.collection("vision_notifications").document(response.job_id).set(
        response.dict()
    )


def save_care_plan(response: CarePlanResponse) -> None:
    client = get_client()
    client.collection("care_plans").document(response.job_id).set(
        response.dict() | {"updated_at": datetime.utcnow().isoformat()}
    )
