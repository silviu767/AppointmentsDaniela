from fastapi import HTTPException
from sqlalchemy.orm import Session
from backend.models.working_hours import WorkingHour
from backend.schemas.working_hours import WorkingHourCreate
from backend.repositories import working_hours as working_hours_repository

def get_all_working_hours(db: Session):
    return working_hours_repository.get_all_working_hours(db)

def create_working_hour(db: Session, working_hour_data: WorkingHourCreate):
    if working_hour_data.ends_at <= working_hour_data.starts_at:
        raise HTTPException(status_code=400,
                            detail="Ora de inchidere trebue da fie dupa ora deschiderii")
    existing_hours = working_hours_repository.get_working_hours_for_day(db, working_hour_data.day_of_week)
   
    for wh in existing_hours:
        if working_hour_data.starts_at < wh.ends_at and working_hour_data.ends_at > wh.starts_at:
            raise HTTPException(status_code=400,
                                detail="Intervalul se suprapune peste unul existent")
    new_working_hour = WorkingHour(day_of_week = working_hour_data.day_of_week,
                                   starts_at = working_hour_data.starts_at,
                                   ends_at = working_hour_data.ends_at)

    return working_hours_repository.create_working_hour(db, new_working_hour)

def delete_working_hour(db: Session, working_hour_id: int):
    working_hour = working_hours_repository.get_working_hour_by_id(db, working_hour_id)
    if working_hour is None:
        raise HTTPException(status_code=404,
                            detail="Intervalul nu a fost gasit ")

    return working_hours_repository.delete_working_hour(db, working_hour)