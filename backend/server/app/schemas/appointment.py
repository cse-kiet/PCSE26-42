from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    doctor_id: int
    patient_id: int
    symptoms: str
    date:datetime
    
class AppointmentUpdate(BaseModel):
    recommendation: str  # ✅ only doctor adds advice


class AppointmentResponse(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    symptoms: str
    date: datetime
    recommendation: str | None
    class Config:
        from_attributes = True   # pydantic v2 me orm_mode ki jagah
