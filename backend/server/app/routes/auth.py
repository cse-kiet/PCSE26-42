# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.models import User, RoleEnum, PatientProfile, DoctorProfile
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import timedelta, datetime
import jwt

from app.auth.auth_bearer import get_current_user

router = APIRouter()

# JWT settings
JWT_SECRET = "YOUR_SECRET_KEY"   # use same key everywhere
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ================= RegisterRequest =================
class RegisterRequest(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: EmailStr
    password: str
    role: RoleEnum
    # Patient fields
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    # Doctor fields
    specialization: Optional[str] = None


# ================= Register Endpoint =================
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    # check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(
        username=user_data.username,
        full_name=user_data.full_name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = None
    if user_data.role == RoleEnum.PATIENT:
        profile = PatientProfile(
            user_id=new_user.id,
            age=user_data.age,
            gender=user_data.gender,
            phone=user_data.phone
        )
    elif user_data.role == RoleEnum.DOCTOR:
        profile = DoctorProfile(
            user_id=new_user.id,
            specialization=user_data.specialization,
            phone=user_data.phone
        )

    if profile:
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value,
        "profile": {
            "id": profile.id if profile else None,
            **({"age": profile.age, "gender": profile.gender, "phone": profile.phone} if isinstance(profile, PatientProfile) else {}),
            **({"specialization": profile.specialization, "phone": profile.phone} if isinstance(profile, DoctorProfile) else {})
        } if profile else None
    }


# ================= /auth/me Endpoint =================
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value
    }


# ================= LoginRequest =================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ================= Login Endpoint =================
@router.post("/login")
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    # 1. find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # 2. verify password
    if not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # 3. create JWT token
    payload = {
        "sub": str(user.id),
        "role": user.role.value,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role.value
        }
    }
