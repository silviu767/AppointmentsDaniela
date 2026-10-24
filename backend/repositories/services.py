from sqlalchemy.orm import Session
from backend.models.services import Service

def get_active_services(db: Session):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.service_id).all()

def get_active_service_by_id(db: Session, service_id: int ):
    return db.query(Service).filter(Service.service_id == service_id, Service.is_active == True ).first()