from sqlalchemy import Column, Integer, DateTime, String, CheckConstraint
from backend.database import Base
from sqlalchemy.sql import func

class BlockedPeriod(Base):
    __tablename__ = "blocked_periods"

    period_id = Column(Integer, primary_key=True, autoincrement=True)
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="valid_period"),
    )