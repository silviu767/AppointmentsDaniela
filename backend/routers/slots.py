from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from datetime import date
from backend.schemas.slots import SlotOut
from backend.services import slots as slots_service

router = APIRouter(prefix="/api/slots",
                   tags=["Slots"])

@router.get("",
            response_model = list[SlotOut])

def get_slots(service_id: int, target_date: date, db: Session = Depends(get_db)):
    return slots_service.get_available_slots(db, service_id, target_date)