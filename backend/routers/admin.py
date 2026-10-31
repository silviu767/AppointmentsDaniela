from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.appointments import AppointmentOut, AppointmentStatusUpdate
from backend.services import appointments as appointments_service
from backend.services import users as user_service 
from backend.schemas.services import    AdminServiceOut, ServiceCreate, ServiceUpdate
from backend.services import services as services_service
from backend.schemas.blocked_periods import BlockedPeriodCreate, BlockedPeriodOut
from backend.services import blocked_periods as blocked_period_service
from backend.schemas.working_hours import WorkingHourCreate, WorkingHourOut
from backend.services import working_hours as working_hours_service
from backend.schemas.photos import PhotoOut, PhotoCreate
from backend.services import photos as photos_services

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

@router.get("/blocked-periods",
            response_model=list[BlockedPeriodOut])

def get_blocked_periods(db: Session =Depends(get_db)):
    return blocked_period_service.get_all_blocked_periods(db)

@router.post("/blocked-periods",
             response_model=BlockedPeriodOut,
             status_code=201)

def create_blocked_periods(period_data: BlockedPeriodCreate,
                           db:Session= Depends(get_db)):
    return blocked_period_service.create_blocked_period(db, period_data)

@router.delete("/blocked-periods/{period_id}",
               status_code=204)

def delete_blocked_periods(period_id: int, db: Session = Depends(get_db)):
    return blocked_period_service.delete_blocked_period(db, period_id)

@router.get("/working-hours",
            response_model=list[WorkingHourOut])

def get_working_hours(db:Session = Depends(get_db)):
    return working_hours_service.get_all_working_hours(db)

@router.post("/working-hours",
             response_model=WorkingHourOut,
             status_code=201)

def create_working_hour(working_hour_data: WorkingHourCreate,
                        db:Session = Depends(get_db)):
    return working_hours_service.create_working_hour(db, working_hour_data)

@router.delete("/working-hours/{working_hour_id}",
               status_code = 204)

def delete_working_hour(working_hour_id: int,
                        db: Session = Depends(get_db)):
    return working_hours_service.delete_working_hour(db, working_hour_id)
@router.post("/photos",
            response_model=PhotoOut,
             status_code= 201 )

def create_photo(photo_data: PhotoCreate, db: Session = Depends(get_db)):
    return photos_services.create_photo(db, photo_data)

@router.delete("/photos/{photo_id}",
               status_code= 204)

def delete_photo(photo_id: int , db: Session = Depends(get_db)):
    return photos_services.delete_photo(db, photo_id)
