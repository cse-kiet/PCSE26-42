from pydantic import BaseModel


# Doctor ka patient list me return hone wala short info
class PatientBrief(BaseModel):
    patient_id: int
    user_id: int
    full_name: str
    email: str
    age: int | None
    gender: str | None
    phone: str | None

    class Config:
        from_attributes = True
