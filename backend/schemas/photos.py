from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from datetime import datetime

class PhotoCreate(BaseModel):
    kind: Literal["gallery", "work"]
    image_url: str = Field(min_length= 1)
    appointment_id: int | None = None

class PhotoOut(BaseModel):
    photo_id: int
    appointment_id: int | None = None
    kind: str
    image_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes = True)

