from datetime import timedelta
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session 
from backend.models.appointments import Appointment
from backend.repositories import appointments as appointment_repository
from backend.schemas.appointments import AppointmentCreate
from backend.models.users import User
from backend.services.slots import get_available_slots, BUSINESS_TZ
from sqlalchemy.exc import IntegrityError
from backend.repositories import services as services_repository 

def create_appointments(db: Session, appointment_data: AppointmentCreate, current_user: User):
    #primul paznic
    service = services_repository.get_active_service_by_id(db, appointment_data.service_id)

    if service is None:
        raise HTTPException(status_code=404, 
                            detail="Serviciul nu a fost gasit!")
    #ceas
    if appointment_data.starts_at.tzinfo is None:
        starts_at = appointment_data.starts_at.replace(tzinfo=BUSINESS_TZ)
    else:
        starts_at = appointment_data.starts_at.astimezone(BUSINESS_TZ)
#paznic 2

    available_slots = get_available_slots(db, appointment_data.service_id, starts_at.date())

    if not any( slot.starts_at == starts_at for slot in available_slots ):

        raise HTTPException(status_code=400,
                            detail="Intervalul ales nu este disponibil")
    
    ends_at = starts_at + timedelta(minutes= service.duration_minutes)

    new_appointment = Appointment(user_id = current_user.user_id,
                                  service_id = service.service_id,
                                  starts_at = starts_at,
                                  ends_at = ends_at,
                                  price_at_booking = service.price,
                                  notes = appointment_data.notes)
    
    try:
        return appointment_repository.create_appointment(db, new_appointment)
    
    except IntegrityError:
        db.rollback()

        raise HTTPException(status_code=409,
                            detail="Acest interval tocmai a fost ocupat!")
    

