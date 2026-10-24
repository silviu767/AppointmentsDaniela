from sqlalchemy.orm import Session
from backend.models.working_hours import WorkingHour

def get_working_hours_for_day(db: Session, day_of_week: int):
    return db.query(WorkingHour).filter(WorkingHour.day_of_week == day_of_week).order_by(WorkingHour.starts_at).all()
