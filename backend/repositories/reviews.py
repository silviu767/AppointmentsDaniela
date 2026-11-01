from sqlalchemy.orm import Session
from backend.models.reviews import Review

def get_approved_reviews(db: Session):
    return db.query(Review).filter(Review.status == "approved").order_by(Review.created_at.desc()).all()

def get_all_reviews(db: Session):
    return db.query(Review).order_by(Review.created_at.desc()).all()

def get_review_by_id(db: Session, review_id: int):
    return db.query(Review).filter(Review.review_id == review_id).first()

def get_review_by_appointment_id(db:Session, appointment_id: int):
    return db.query(Review).filter(Review.appointment_id == appointment_id).first()

def create_review(db:Session, review: Review):
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def update_review(db: Session, review: Review):
    db.commit()
    db.refresh(review)
    return review