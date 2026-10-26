from argon2 import PasswordHasher
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.users import User
from backend.repositories import users as user_repository 
from backend.schemas.users import UserCreate, UserLogin, TokenOut
from datetime import datetime, timedelta, timezone
import jwt
from argon2.exceptions import VerifyMismatchError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.database import get_db
import os 
from dotenv import load_dotenv

ph = PasswordHasher()
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
security = HTTPBearer()

def register_user(db: Session, user_data: UserCreate):
    existing_user = user_repository.get_user_by_email(db, user_data.email)
    if existing_user is not None:
        raise HTTPException(status_code=400,
                            detail="Acest email este deja folosit")
    hashed_password = ph.hash(user_data.password)

    new_user = User(email = user_data.email,
                     phone = user_data.phone,
                     first_name = user_data.first_name,
                     last_name = user_data.last_name,
                     password_hash = hashed_password)

    return user_repository.create_user(db, new_user)

def login_user(db: Session, login_data: UserLogin):
    user = user_repository.get_user_by_email(db, login_data.email)

    if user is None or user.password_hash is None:
        raise HTTPException(status_code=401,
                            detail="Email sau parola incorecta")
    try:
        ph.verify(user.password_hash, login_data.password)

    except VerifyMismatchError:
         raise HTTPException(status_code=401,
                            detail="Email sau parola incorecta")

    payload = {
        "sub": str(user.user_id),
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return TokenOut(access_token=token)

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalid sau expirat")

    user = user_repository.get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(status_code=401, detail="Utilizatorul nu a fost gasit")
    
    return user