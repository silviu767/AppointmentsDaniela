from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class Photo(Base):
    __tablename__ = "photos"

    photo_id = Column(Integer, primary_key=True, autoincrement=True)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id", ondelete="RESTRICT"), nullable=True)
    kind = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("kind IN ('gallery', 'work')", name="valid_kind"), 
        CheckConstraint("appointment_id is NULL or kind = 'work'", name="appointment_only_for_work")
    )
