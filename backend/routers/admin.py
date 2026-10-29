from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.appointments import AppointmentOut, AppointmentStatusUpdate
from backend.services import appointments as appointments_service
from backend.services import users as user_service 
from backend.schemas.services import    AdminServiceOut, ServiceCreate, ServiceUpdate
from backend.services import services as services_service

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

@router.get("/services", 
            response_model=list[AdminServiceOut])
def get_all_services(db: Session = Depends(get_db)):
    return services_service.get_all_services(db)

@router.post("/services",
             response_model=AdminServiceOut,
             status_code= 201 )

def create_service(service_data: ServiceCreate, db: Session = Depends(get_db)):
    return services_service.create_service(db, service_data)

@router.patch("/services/{service_id}",
              response_model=AdminServiceOut)

def update_service(service_id: int, service_data: ServiceUpdate, db: Session = Depends(get_db)):
    return services_service.update_service(db, service_id, service_data)