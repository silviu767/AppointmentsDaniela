from sqlalchemy import Column, Integer, String, Boolean, CheckConstraint, Text, Numeric
from backend.database import Base

class Service(Base):
    __tablename__ = "services"

    service_id = Column(Integer, primary_key=True, autoincrement=True )
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String, nullable=True )
    is_active = Column(Boolean, server_default="true", nullable=False )

    __table_args__ = (
        CheckConstraint("duration_minutes > 0", name="duration_positive"),
        CheckConstraint("price >= 0", name="price_non_negative"),
        CheckConstraint("length(trim(name)) > 0", name="name_not_empty"),
    )