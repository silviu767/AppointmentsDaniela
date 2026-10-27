from pydantic import BaseModel, ConfigDict
from datetime import datetime   
from decimal import Decimal

class AppointmentCreate(BaseModel):
    service_id: int
    starts_at: datetime
    notes: str | None = None


class AppointmentOut(BaseModel):
    appointment_id: int
    user_id: int
    service_id: int
    starts_at: datetime
    ends_at: datetime
    price_at_booking: Decimal
    status: str
    notes: str | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)