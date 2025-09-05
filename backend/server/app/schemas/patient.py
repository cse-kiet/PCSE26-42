from pydantic import BaseModel


# Patient doctor select karega
class SelectDoctorRequest(BaseModel):
    doctor_user_id: int
