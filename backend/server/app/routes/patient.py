# server/app/routes/patient.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_current_patient
from app.models.database import get_db
from app.models.models import DoctorProfile, PatientProfile, DoctorPatient
from app.models.user import User 
from app.schemas.patient import SelectDoctorRequest

router = APIRouter()

@router.get("/doctors")
def list_doctors(db: Session = Depends(get_db)):
    q = db.query(DoctorProfile).all()
    out = []
    for d in q:
        u = db.query(User).get(d.user_id)
        out.append({
            "doctor_user_id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "specialization": d.specialization
        })
    return out

@router.post("/select-doctor")
def select_doctor(payload: SelectDoctorRequest, current=Depends(get_current_patient), db: Session = Depends(get_db)):
    patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == current.id).first()
    if not patient_profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    doctor_user = db.query(User).get(payload.doctor_user_id)
    if not doctor_user:
        raise HTTPException(status_code=404, detail="Doctor user not found")
    doctor_profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == doctor_user.id).first()
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    # Create link if not exists
    exists = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_profile.id,
        DoctorPatient.patient_id == patient_profile.id
    ).first()
    if not exists:
        db.add(DoctorPatient(doctor_id=doctor_profile.id, patient_id=patient_profile.id))
        db.commit()
    return {"message": "Doctor selected"}
