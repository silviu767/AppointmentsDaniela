from  fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.users import UserCreate, UserOut, UserLogin, TokenOut
from backend.services import users as users_service

router = APIRouter(prefix="/api/users",
                   tags = ['Users'])

@router.post("/register",
             response_model=UserOut,
             status_code=201
             )

def post_users(user_data: UserCreate, db: Session = Depends(get_db)):
    return users_service.register_user(db, user_data)

@router.post("/login",
             response_model=TokenOut)

def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return users_service.login_user(db, user_data)


@router.get("/me",
            response_model=UserOut)

def get_me(current_user = Depends(users_service.get_current_user)):
    return current_user