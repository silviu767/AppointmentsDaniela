from sqlalchemy import Column, String, Text, DateTime, Integer, CheckConstraint, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, autoincrement=True)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id", ondelete="RESTRICT"), nullable=False, unique=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True )
    status = Column(String, nullable=False, server_default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="rating_between_1_and_5"),
        CheckConstraint("status IN ('pending', 'approved', 'rejected')",
                        name="valid_status")
    )