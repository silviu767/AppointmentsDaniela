from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.appointments import AppointmentCreate, AppointmentOut
from backend.services import appointments as appointments_service
from backend.services import users as user_service
from backend.schemas.photos import PhotoOut
from backend.services import photos as photos_service
from backend.services.email import send_appointment_received_email, send_admin_new_appointment_email, send_admin_appointment_cancelled_by_client_email
from backend.repositories import users as users_repository

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentOut, status_code=201)

def create_appointment(appointment_data: AppointmentCreate,
                       background_task: BackgroundTasks, 
                       db: Session = Depends(get_db), 
                       current_user = Depends(user_service.get_current_user)):
    appointment = appointments_service.create_appointments(db, appointment_data, current_user)

    background_task.add_task(send_appointment_received_email, current_user.email, current_user.first_name, str(appointment.starts_at))
    
    admin = users_repository.get_admin_user(db)

    if admin and admin.email is not None:
        background_task.add_task(send_admin_new_appointment_email, admin.email, current_user.first_name, str(appointment.starts_at))
    
    return appointment

   


@router.get("/me", response_model=list[AppointmentOut])

def get_appointments(db: Session = Depends(get_db),
                      current_user = Depends(user_service.get_current_user)):
    return appointments_service.get_my_appointments(db, current_user)

@router.post("/{appointment_id}/cancel",
             response_model= AppointmentOut)

def cancel_appointment(background_task: BackgroundTasks, appointment_id: int, 
                       db: Session = Depends(get_db), 
                       current_user = Depends(user_service.get_current_user)):
    cancelled = appointments_service.cancel_appointment(db, appointment_id, current_user)
    admin = users_repository.get_admin_user(db)

    if admin and admin.email is not None:
        background_task.add_task(send_admin_appointment_cancelled_by_client_email, admin.email, current_user.first_name, str(cancelled.starts_at))

    return cancelled

@router.get("/{appointment_id}/photos",
            response_model=list[PhotoOut])

def get_photo_by_appointments(appointment_id: int,
                              db: Session = Depends(get_db),
                              current_user = Depends(user_service.get_current_user)):
    return photos_service.get_photo_by_appointment(db, appointment_id, current_user)