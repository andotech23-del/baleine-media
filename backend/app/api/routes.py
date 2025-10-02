from fastapi import APIRouter, Depends

from ..dependencies.auth import authenticate
from ..schemas import (
    Appointment,
    AppointmentCreate,
    BillingPayload,
    BillingResponse,
    CarePlanPayload,
    CarePlanResponse,
    ScribePayload,
    ScribeResponse,
    VisionPayload,
    VisionResponse,
)
from ..services import agents, firestore

router = APIRouter(prefix="/api", dependencies=[Depends(authenticate)])


@router.get("/appointments", response_model=list[Appointment])
def list_appointments() -> list[Appointment]:
    return firestore.list_appointments()


@router.post("/appointments", response_model=Appointment)
def create_appointment(payload: AppointmentCreate) -> Appointment:
    return firestore.create_appointment(payload)


@router.post("/scribe", response_model=ScribeResponse)
def run_scribe(payload: ScribePayload) -> ScribeResponse:
    return agents.invoke_agent("scribe", payload.dict())


@router.post("/billing", response_model=BillingResponse)
def run_billing(payload: BillingPayload) -> BillingResponse:
    response = agents.invoke_agent("billing", payload.dict())
    firestore.save_billing(response)
    return response


@router.post("/vision", response_model=VisionResponse)
def run_vision(payload: VisionPayload) -> VisionResponse:
    response = agents.invoke_agent("vision", payload.dict())
    firestore.save_vision_notification(response)
    return response


@router.post("/care", response_model=CarePlanResponse)
def run_care(payload: CarePlanPayload) -> CarePlanResponse:
    response = agents.invoke_agent("care", payload.dict())
    firestore.save_care_plan(response)
    return response
