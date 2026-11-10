from datetime import datetime 
from pydantic import BaseModel, ConfigDict, EmailStr, Field
#ce intra de la client
class UserCreate(BaseModel):
    email: EmailStr
    phone: str | None = None
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    password: str = Field(min_length=8)

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
