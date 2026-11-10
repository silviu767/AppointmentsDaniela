from fastapi import HTTPException, UploadFile
from typing import Literal 
from backend.services import storage as storage_service
from sqlalchemy.orm import  Session
from backend.models.photos import Photo
from backend.models.users import User
from backend.schemas.photos import PhotoCreate
from backend.repositories import photos as photos_repository
from backend.repositories import appointments as appointments_repository 

def get_photos(db:Session):
    return photos_repository.get_photos_by_kind(db, "gallery")
def create_photo(db: Session, file: UploadFile, 
                 kind: Literal["gallery", "work"], 
                 appointment_id: int | None = None):
    
    if kind == "gallery" and appointment_id is not None:
        raise HTTPException(status_code= 400,
                            detail="Pozele de tip gallery nu pot fi asociate unei programari")

    if appointment_id is not None:
        appointment = appointments_repository.get_appointment_by_id(db, appointment_id)
        if appointment is None:
            raise HTTPException(status_code=404,
                                detail="Programarea nu a fost gasita")
        
    image_url = storage_service.upload_photo_file(file)

    new_photo = Photo(kind = kind,
                    image_url = image_url,
                    appointment_id = appointment_id)
    
    return photos_repository.create_photo(db, new_photo)

def delete_photo(db:Session, photo_id: int):
    photo = photos_repository.get_photo_by_id(db, photo_id)
    if photo is None:
        raise HTTPException(status_code=404,
                            detail="Poza nu a fost gasita")
    
    storage_service.delete_photo_file(photo.image_url)

    return photos_repository.delete_photo(db, photo)


def get_photo_by_appointment(db: Session, appointment_id: int, current_user: User):
    appointment = appointments_repository.get_appointment_by_id(db, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404,
                            detail="Programare inexistenta")
    if appointment.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403,
                            detail="Acces interzis la pozele acestei programari")
    return photos_repository.get_photos_by_appointments(db, appointment_id)


def create_client_work_photo(db: Session,  appointment_id: int, 
                             file: UploadFile, current_user: User):
    appoiment = appointments_repository.get_appointment_by_id(db, appointment_id)

    if appoiment is None:
        raise HTTPException(status_code=404,
                            detail="Programarea nu a fost gasita")
    
    if appoiment.user_id != current_user.user_id:
        raise HTTPException(status_code=403,
                            detail="Nu poti incarca poze la programarea altcuiva")
    
    if appoiment.status != "completed":
        raise HTTPException(status_code=400,
                            detail="Poti incarca poze doar pentru o programare finalizata")
    
    image_url = storage_service.upload_photo_file(file)

    new_photo = Photo(kind = "work",
                      image_url = image_url,
                      appointment_id = appointment_id)

    return photos_repository.create_photo(db, new_photo)
    