from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.appointments import AppointmentOut, AppointmentStatusUpdate
from backend.services import appointments as appointments_service
from backend.services import users as user_service 

router = APIRouter(prefix="/api/admin",
                   tags=["Admin"],
                   dependencies= [Depends(user_service.get_current_admin)])

@router.get("/appointments",
            response_model=list[AppointmentOut])

def get_all_appointments(db: Session = Depends(get_db)):
    return appointments_service.get_all_appointments(db)

@router.patch("/appointments/{appointment_id}/status",
              response_model=AppointmentOut)

def update_appointment_status(appointment_id: int, 
                              status_data: AppointmentStatusUpdate, 
                              db: Session = Depends(get_db)):
    return appointments_service.update_appointment_status(db, appointment_id, status_data)
