from sqlalchemy.orm import Session
from backend.repositories import services as services_repository

def get_active_services(db:Session):
    return services_repository.get_active_services(db)