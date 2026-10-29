from sqlalchemy.orm import Session
from backend.models.services import Service

def get_active_services(db: Session):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.service_id).all()

def get_active_service_by_id(db: Session, service_id: int ):
    return db.query(Service).filter(Service.service_id == service_id, Service.is_active == True ).first()

def get_all_services(db: Session):
    return db.query(Service).order_by(Service.service_id).all()

def get_service_by_id(db: Session, service_id: int):
    return db.query(Service).filter(Service.service_id == service_id).first()

def get_service_by_name(db: Session, name: str):
    return db.query(Service).filter(Service.name == name).first()
#creaza un serviciu
def create_service(db: Session, service: Service):
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

def update_service(db: Session, service: Service):
    db.commit()
    db.refresh(service)
    return service 
