from sqlalchemy.orm import Session
from backend.repositories import services as services_repository
from fastapi import HTTPException
from backend.models.services import Service
from backend.schemas.services import ServiceCreate, ServiceUpdate

def get_active_services(db:Session):
    return services_repository.get_active_services(db)

def get_all_services(db: Session):
    return services_repository.get_all_services(db)

def create_service(db: Session, service_data: ServiceCreate):
    service = services_repository.get_service_by_name(db, service_data.name)
    if service is not None:
        raise HTTPException(status_code= 400,
                            detail="Serviciul este existent")
    
    new_service = Service( name = service_data.name,
                          description = service_data.description,
                          duration_minutes= service_data.duration_minutes,
                          price = service_data.price,
                          image_url = service_data.image_url,
                          is_active = service_data.is_active)
    
    return services_repository.create_service(db, new_service)

def update_service(db: Session, service_id: int, service_data: ServiceUpdate):
    service = services_repository.get_service_by_id(db, service_id)
    if service is None:
        raise HTTPException(status_code=404,
                            detail="Serviciul nu a fost gasit")
    updates = service_data.model_dump(exclude_unset=True)
    info = ("name", "duration_minutes", "price")
    for field in info:
        if field in updates and updates[field] is None:
            raise HTTPException(status_code= 400,
                                detail = f"Campul {field} nu poate fi gol")
        
    if "name" in updates and updates["name"] != service.name:
        existing_service = services_repository.get_service_by_name(db, updates["name"])
        if existing_service is not None:
            raise HTTPException(status_code=400,
                                detail="Un serviciu cu acest nume exista deja")

    for key, value in updates.items():
         setattr(service, key, value)

    return services_repository.update_service(db, service)