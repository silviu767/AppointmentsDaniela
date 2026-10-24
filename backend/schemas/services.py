from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class ServiceOut(BaseModel):

    service_id: int 
    name: str
    description: str | None = None
    duration_minutes: int
    price: Decimal
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)