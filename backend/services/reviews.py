from fastapi import HTTPException
from sqlalchemy.orm import Session
from backend.models.reviews import Review
from backend.models.users import User
from backend.schemas.reviews import ReviewCreate, ReviewStatusUpdate
from backend.repositories import reviews as reviews_repository
from backend.repositories import appointments as appointments_repository

def get_approved_reviews(db: Session):
    return reviews_repository.get_approved_reviews(db)

def create_review(db:Session, review_data: ReviewCreate, current_user: User):
    appointment = appointments_repository.get_appointment_by_id(db, review_data.appointment_id)
   
    if appointment is None:
        raise HTTPException(status_code=404,
                            detail="Programarea nu a fost gasita")

    if appointment.user_id != current_user.user_id:
        raise HTTPException(status_code=403,
                            detail="Nu poti lasa o recenzie pentru programarea altcuiva")

    if appointment.status != "completed":
        raise HTTPException(status_code=400,
                            detail="Poti lasa o recenzie doar pentru o programare finalizata")

   
    existing_reviews = reviews_repository.get_review_by_appointment_id(db, review_data.appointment_id)
    
    if existing_reviews is not None:
        raise HTTPException(status_code=409,
                            detail = "Exista deja o recenzie la aceasta programare")

    new_review = Review(appointment_id = review_data.appointment_id,
                        rating = review_data.rating,
                        comment = review_data.comment)
   
    return reviews_repository.create_review(db, new_review)

def get_all_reviews(db: Session):
    return reviews_repository.get_all_reviews(db)

def update_review_status(db: Session, review_id: int, status_data: ReviewStatusUpdate):
    review = reviews_repository.get_review_by_id(db, review_id)

    if review is None:
        raise HTTPException(status_code=404,
                            detail="Recenzia nu a fost gasita")

    review.status = status_data.status

    return reviews_repository.update_review(db, review)