from datetime import datetime 
from pydantic import BaseModel, ConfigDict, EmailStr
#ce intra de la client
class UserCreate(BaseModel):
    email: EmailStr
    phone: str | None = None
    first_name: str
    last_name: str
    password: str
#ce pleaca pe browser
class UserOut(BaseModel):
    user_id: int 
    email: str | None = None
    phone: str | None = None
    first_name: str
    last_name: str
    role: str
    email_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
