from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.appointments import AppointmentCreate, AppointmentOut
from backend.services import appointments as appointments_service
from backend.services import users as user_service
from backend.schemas.photos import PhotoOut
from backend.services import photos as photos_service

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentOut, status_code=201)

def create_appointment(appointment_data: AppointmentCreate, 
                       db: Session = Depends(get_db), 
                       current_user = Depends(user_service.get_current_user)):
    return appointments_service.create_appointments(db, appointment_data, current_user)

@router.get("/me", response_model=list[AppointmentOut])

def get_appointments(db: Session = Depends(get_db),
                      current_user = Depends(user_service.get_current_user)):
    return appointments_service.get_my_appointments(db, current_user)

@router.post("/{appointment_id}/cancel",
             response_model= AppointmentOut)

def cancel_appointment(appointment_id: int, 
                       db: Session = Depends(get_db), 
                       current_user = Depends(user_service.get_current_user)):
    return appointments_service.cancel_appointment(db, appointment_id, current_user)

@router.get("/{appointment_id}/photos",
            response_model=list[PhotoOut])

def get_photo_by_appointments(appointment_id: int,
                              db: Session = Depends(get_db),
                              current_user = Depends(user_service.get_current_user)):
    return photos_service.get_photo_by_appointment(db, appointment_id, current_user)