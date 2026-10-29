from sqlalchemy.orm import Session
from backend.models.working_hours import WorkingHour

def get_working_hours_for_day(db: Session, day_of_week: int):
    return db.query(WorkingHour).filter(WorkingHour.day_of_week == day_of_week).order_by(WorkingHour.starts_at).all()

def get_all_working_hours(db: Session):
    return db.query(WorkingHour).order_by(WorkingHour.day_of_week, WorkingHour.starts_at).all()

def get_working_hour_by_id(db: Session, working_hour_id: int):
    return db.query(WorkingHour).filter(WorkingHour.working_hour_id == working_hour_id).first()

def create_working_hour(db: Session, working_hour: WorkingHour):
    db.add(working_hour)
    db.commit()
    db.refresh(working_hour)
    return working_hour

def delete_working_hour(db:Session, working_hour: WorkingHour):
    db.delete(working_hour)
    db.commit()
    