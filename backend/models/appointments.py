from sqlalchemy import Column, Integer, DateTime, Numeric, String, Text, CheckConstraint, ForeignKey, text
from sqlalchemy.sql import func
from backend.database import Base
from sqlalchemy.dialects.postgresql import ExcludeConstraint

class Appointment(Base):
    __tablename__ = "appointments"

    appointment_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.service_id", ondelete="RESTRICT"), nullable=False)
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    price_at_booking = Column(Numeric(10,2), nullable=False)
    status = Column(String, nullable=False, server_default="pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("price_at_booking >= 0", name="price_non_negative"),
        CheckConstraint("ends_at > starts_at", name="valid_appointment_hour"),
        CheckConstraint(
            "status IN ('pending', 'confirmed', 'completed', 'cancelled_by_client', 'cancelled_by_admin', 'no_show')",
            name="valid_status"
        ),
        ExcludeConstraint(
            (text("tstzrange(starts_at, ends_at)"), "&&"),
            using="gist",
            where=text("status IN ('pending', 'confirmed')"),
            name="no_overlapping_appointments",
        ),
    )