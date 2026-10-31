from sqlalchemy.orm import Session
from backend.models.photos import Photo

def get_all_photos(db: Session):
    return db.query(Photo).order_by(Photo.created_at.desc()).all()

def get_photos_by_kind(db:Session, kind: str):
    return db.query(Photo).filter(Photo.kind == kind).order_by(Photo.created_at.desc()).all()

def get_photo_by_id(db:Session, photo_id: int):
    return db.query(Photo).filter(Photo.photo_id == photo_id).first()

def create_photo(db:Session, photo: Photo):
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo

def delete_photo(db: Session, photo:Photo):
    db.delete(photo)
    db.commit()

def get_photos_by_appointments(db: Session, appointment_id: int):
    return db.query(Photo).filter(Photo.appointment_id == appointment_id).order_by(Photo.created_at.desc()).all()
