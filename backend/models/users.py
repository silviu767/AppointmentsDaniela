from sqlalchemy import Column, Integer, String, Boolean, DateTime, CheckConstraint
from backend.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    role = Column(String, server_default="client", nullable=False)
    email_verified = Column(Boolean, server_default="false", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("email IS NOT NULL OR phone IS NOT NULL", name ="email_or_phone_required"),
        CheckConstraint("role IN('client', 'admin')", name="valid_role"),
    )