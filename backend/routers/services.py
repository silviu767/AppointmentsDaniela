from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.services import ServiceOut
from backend.services import services as services_service

router = APIRouter(prefix="/api/services", tags=["Services"])

@router.get("", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return services_service.get_active_services(db)