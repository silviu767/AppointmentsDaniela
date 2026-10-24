from sqlalchemy.orm import Session
from backend.models.services import Service

def get_active_services(db: Session):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.service_id).all()