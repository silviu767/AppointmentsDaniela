from sqlalchemy import Integer, Time, Column, CheckConstraint, UniqueConstraint
from backend.database import Base

class WorkingHour(Base):
    __tablename__ = "working_hour"

    working_hour_id = Column(Integer, primary_key=True, autoincrement=True )
    day_of_week = Column(Integer, nullable=False) #luni = 0
    starts_at = Column(Time, nullable=False)
    ends_at = Column(Time, nullable=False)

    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="valid_hours"),
        CheckConstraint("day_of_week BETWEEN 0 AND 6", name="valid_days"), 
        UniqueConstraint("day_of_week", "stars_at", name="uq_day_starts_at")
    )