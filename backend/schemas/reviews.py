from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from datetime import datetime

class ReviewCreate(BaseModel):
    appointment_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default = None, max_length= 1000)

class ReviewStatusUpdate(BaseModel):
    status: Literal["approved", "rejected"]

class ReviewOut(BaseModel):
    review_id: int
    appointment_id: int  
    rating: int
    comment: str | None = None
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
