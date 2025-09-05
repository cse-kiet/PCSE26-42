from pydantic import BaseModel, EmailStr
from app.models.models import RoleEnum
from typing import Optional

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: RoleEnum
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
