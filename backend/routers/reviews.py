from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.reviews import ReviewCreate, ReviewOut
from backend.services import reviews as reviews_services
from backend.services import users as users_services
from backend.repositories import users as users_repository 
from backend.services.email import send_admin_new_review_email

router = APIRouter(prefix="/api/reviews",
                   tags=["Reviews"])

@router.get("",
            response_model=list[ReviewOut])

def get_approved_reviews(db: Session = Depends(get_db)):
    return reviews_services.get_approved_reviews(db)

@router.post("",
             response_model=ReviewOut,
             status_code=201)

def create_review(review_data: ReviewCreate, background_task: BackgroundTasks,
                   db: Session = Depends(get_db),
                   current_user = Depends(users_services.get_current_user)):
    review = reviews_services.create_review(db, review_data, current_user)
    
    admin = users_repository.get_admin_user(db)

    if admin and admin.email is not None:
        background_task.add_task(send_admin_new_review_email, admin.email, review.rating, review.comment)

    return review


