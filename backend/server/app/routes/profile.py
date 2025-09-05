from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models import User, PatientProfile, DoctorProfile
import shutil, os

router = APIRouter()

UPLOAD_DIR = "uploads/profile_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ================= GET Patient Profile =================
@router.get("/patient/{user_id}")
def get_patient_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    patient = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()

    if not user or not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value,
        "phone": patient.phone,
        "gender": patient.gender,
        "age": patient.age,
        "blood_group": patient.blood_group,
        "medical_history": patient.medical_history,
        "profile_image": patient.profile_image,
        "avatar": patient.avatar,
    }


# ================= GET Doctor Profile =================
@router.get("/doctor/{user_id}")
def get_doctor_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    doctor = db.query(DoctorProfile).filter(DoctorProfile.user_id == user_id).first()

    if not user or not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value,
        "phone": doctor.phone,
        "specialization": doctor.specialization,
        "experience": doctor.experience,
        "hospital": doctor.hospital,
        "profile_image": doctor.profile_image,
        "avatar": doctor.avatar,
    }


# ================= UPDATE Patient Profile =================
@router.put("/patient/{user_id}")
async def update_patient_profile(
    user_id: int,
    full_name: str = Form(None),
    email: str = Form(None),
    phone: str = Form(None),
    gender: str = Form(None),
    age: int = Form(None),  # instead of str
    blood_group: str = Form(None),
    medical_history: str = Form(None),
    avatar: str = Form(None),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    patient = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()

    if not user or not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Save image if uploaded
    if profile_image:
        image_path = os.path.join(UPLOAD_DIR, profile_image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)
        patient.profile_image = image_path

    # Update User fields
    if full_name:
        user.full_name = full_name
    if email:
        user.email = email

    # Update Patient fields
    if phone:
        patient.phone = phone
    if gender:
        patient.gender = gender
    if age is not None:
        patient.age = age
    if blood_group is not None:
        patient.blood_group = blood_group
    if medical_history is not None:
        patient.medical_history = medical_history
    if avatar:
        patient.avatar = avatar

    db.commit()
    db.refresh(user)
    db.refresh(patient)

    return {"message": "Patient profile updated successfully"}


# ================= UPDATE Doctor Profile =================
@router.put("/doctor/{user_id}")
async def update_doctor_profile(
    user_id: int,
    full_name: str = Form(None),
    email: str = Form(None),
    phone: str = Form(None),
    gender: str = Form(None),
    specialization: str = Form(None),
    experience: str = Form(None),
    hospital: str = Form(None),
    avatar: str = Form(None),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    doctor = db.query(DoctorProfile).filter(DoctorProfile.user_id == user_id).first()

    if not user or not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Save image if uploaded
    if profile_image:
        image_path = os.path.join(UPLOAD_DIR, profile_image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)
        doctor.profile_image = image_path

    # Update User fields
    if full_name:
        user.full_name = full_name
    if email:
        user.email = email

    # Update Doctor fields
    if phone:
        doctor.phone = phone
    if gender:
        doctor.gender = gender
    if specialization:
        doctor.specialization = specialization
    if experience:
        doctor.experience = experience
    if hospital:
        doctor.hospital = hospital
    if avatar:
        doctor.avatar = avatar

    db.commit()
    return {"message": "Doctor profile updated successfully"}
