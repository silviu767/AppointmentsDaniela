from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

class ServiceOut(BaseModel):
    service_id: int 
    name: str
    description: str | None = None
    duration_minutes: int
    price: Decimal
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

class AdminServiceOut(ServiceOut):
    is_active: bool

class ServiceCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str | None = None
    duration_minutes: int = Field(gt = 0)
    price: Decimal = Field(ge=0)
    image_url: str | None = None
    is_active: bool = True

class ServiceUpdate(BaseModel):
    name:str | None = Field(default=None, min_length=1)
    description: str | None = None
    duration_minutes: int | None = Field(default=None, gt = 0)
    price: Decimal | None = Field(default= None, ge = 0)
    image_url: str | None = None
    is_active: bool | None = None