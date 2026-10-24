from datetime import datetime
from pydantic import BaseModel

class SlotOut(BaseModel):
    starts_at: datetime
    ends_at: datetime
    