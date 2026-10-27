from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.appointments import Appointment

def get_active_appointments_for_day(db: Session, day_start: datetime, day_end: datetime):
    return db.query(Appointment).filter(Appointment.starts_at < day_end, Appointment.ends_at >day_start, Appointment.status.in_(['pending', 'confirmed'])).order_by(Appointment.starts_at).all()

def create_appointment(db: Session, appointment: Appointment):
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment

def get_appointments_by_user(db: Session, user_id: int):
    return db.query(Appointment).filter(Appointment.user_id == user_id).order_by(Appointment.starts_at).all()

def get_appointment_by_id(db: Session, appointment_id: int):
    return db.query(Appointment).filter(Appointment.appointment_id == appointment_id).first()

def update_appointment(db: Session, appoinntment: Appointment):
    db.commit()
    db.refresh(appoinntment)
    return appoinntment