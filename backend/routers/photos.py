from fastapi import APIRouter, Depends
from typing import Literal
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.photos import PhotoOut
from backend.services import photos as photos_service

router = APIRouter(prefix="/api/photos", tags=["Photos"])

@router.get("", response_model= list[PhotoOut])

def get_photos(kind: Literal["gallery", "work"] | None = None, 
               db: Session = Depends(get_db)):
    return photos_service.get_photos(db, kind)

