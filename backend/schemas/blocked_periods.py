from datetime import datetime
from pydantic import BaseModel, ConfigDict

class BlockedPeriodCreate(BaseModel):
    starts_at: datetime
    ends_at: datetime
    reason: str | None = None 

class BlockedPeriodOut(BaseModel):
    period_id: int
    starts_at: datetime
    ends_at: datetime 
    reason: str | None = None
    created_at: datetime 

    model_config = ConfigDict(from_attributes=True)
    