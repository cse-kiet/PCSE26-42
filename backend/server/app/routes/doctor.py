from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, distinct

from app.models.database import get_db
from app.models.models import User, PatientProfile
from app.models.appointment import Appointment  # make sure this import works

router = APIRouter()

# ---------------- List Patients via Appointments (No Auth) ----------------
@router.get("/patients")
def list_patients(doctor_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Fetch patients linked to a doctor via appointments.
    No token/authorization needed.
    """
    try:
        # Get distinct patient IDs from appointments for this doctor
        stmt = select(distinct(Appointment.patient_id)).where(Appointment.doctor_id == doctor_id)
        patient_ids = [row[0] for row in db.execute(stmt).all()]

        patients = []
        if patient_ids:
            users = db.query(User).filter(User.id.in_(patient_ids), User.role == "PATIENT").all()
            for user in users:
                # Fetch profile details
                profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
                patients.append({
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "age": profile.age if profile else None,
                    "gender": profile.gender if profile else None,
                    "phone": profile.phone if profile else None
                })

        return patients
    except Exception as e:
        print("🚨 ERROR fetching patients:", e)
        return {"error": str(e)}
