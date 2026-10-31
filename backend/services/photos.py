from fastapi import HTTPException
from sqlalchemy.orm import  Session
from backend.models.photos import Photo
from backend.models.users import User
from backend.schemas.photos import PhotoCreate
from backend.repositories import photos as photos_repository
from backend.repositories import appointments as appointments_repository 

def get_photos(db:Session, kind: str | None = None):
    if kind is None:
        return photos_repository.get_all_photos(db)
    elif kind == "gallery" or kind == "work":
        return photos_repository.get_photos_by_kind(db, kind)

def create_photo(db: Session, photo_data: PhotoCreate):
    if photo_data.kind == "gallery" and photo_data.appointment_id is not None:
        raise HTTPException(status_code= 400,
                            detail="Pozele de tip gallery nu pot fi asociate unei programari")

    if photo_data.appointment_id is not None:
        appointment = appointments_repository.get_appointment_by_id(db, photo_data.appointment_id)
        if appointment is None:
            raise HTTPException(status_code=404,
                                detail="Programarea nu a fost gasita")
    new_photo = Photo(kind = photo_data.kind,
                    image_url = photo_data.image_url,
                    appointment_id = photo_data.appointment_id)
    
    return photos_repository.create_photo(db, new_photo)

def delete_photo(db:Session, photo_id: int):
    photo = photos_repository.get_photo_by_id(db, photo_id)
    if photo is None:
        raise HTTPException(status_code=404,
                            detail="Poza nu a fost gasita")

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

