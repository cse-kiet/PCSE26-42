# server/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: Literal["patient", "doctor"]

    class Config:
        from_attributes = True
