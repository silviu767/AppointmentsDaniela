from  fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.users import UserCreate, UserOut, UserLogin, TokenOut
from backend.services import users as users_service
from backend.limiter import limiter

router = APIRouter(prefix="/api/users",
                   tags = ['Users'])

@router.post("/register",
             response_model=UserOut,
             status_code=201
             )
@limiter.limit("5/minute")

def post_users(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    return users_service.register_user(db, user_data)

@router.post("/login",
             response_model=TokenOut)

@limiter.limit("5/minute")

def login(request: Request, user_data: UserLogin, db: Session = Depends(get_db)):
    return users_service.login_user(db, user_data)


@router.get("/me",
            response_model=UserOut)

def get_me(current_user = Depends(users_service.get_current_user)):
    return current_user