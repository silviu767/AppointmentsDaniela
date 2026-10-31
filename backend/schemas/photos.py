from pydantic import BaseModel, ConfigDict
from typing import Literal
from datetime import datetime

class PhotoCreate(BaseModel):
    kind: Literal["gallery", "work"]
    image_url: str
    appointment_id: int | None = None

class PhotoOut(BaseModel):
    photo_id: int
    appointment_id: int | None = None
    kind: str
    image_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes = True)

