# server/app/routes/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.models.database import get_db
from app.schemas.user import UserOut
from app.models.models import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)):
    return current
