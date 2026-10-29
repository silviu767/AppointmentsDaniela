from datetime import time 
from pydantic import BaseModel, ConfigDict, Field

class WorkingHourCreate(BaseModel):
    day_of_week: int = Field(ge = 0, le = 6)
    starts_at: time
    ends_at: time

class WorkingHourOut(BaseModel):
    working_hour_id: int
    day_of_week: int
    starts_at: time
    ends_at: time 

    model_config = ConfigDict(from_attributes=True)
    