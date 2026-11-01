from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.reviews import ReviewCreate, ReviewOut
from backend.services import reviews as reviews_services
from backend.services import users as users_services

router = APIRouter(prefix="/api/reviews",
                   tags=["Reviews"])

@router.get("",
            response_model=list[ReviewOut])

def get_approved_reviews(db: Session = Depends(get_db)):
    return reviews_services.get_approved_reviews(db)

@router.post("",
             response_model=ReviewOut,
             status_code=201)

def create_review(review_data: ReviewCreate, db: Session = Depends(get_db),
                   current_user = Depends(users_services.get_current_user)):
    return reviews_services.create_review(db, review_data, current_user)

