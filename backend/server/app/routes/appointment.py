from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.database import get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentResponse,AppointmentUpdate
from typing import List

router = APIRouter()

# ✅ Create Appointment
@router.post("/", response_model=AppointmentResponse)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    doctor = db.query(User).filter(User.id == data.doctor_id, User.role == "DOCTOR").first()
    patient = db.query(User).filter(User.id == data.patient_id, User.role == "PATIENT").first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    appointment = Appointment(
        doctor_id=data.doctor_id,
        patient_id=data.patient_id,
        symptoms=data.symptoms,
        date=datetime.utcnow()
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment

# ✅ Get All Appointments
@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

# ✅ Get Appointment by ID
@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

#  Doctor adds recommendation/advice
@router.put("/{appointment_id}/recommendation", response_model=AppointmentResponse)
def add_recommendation(appointment_id: int, data: AppointmentUpdate, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.recommendation = data.recommendation
    appointment.response_date = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    return appointment



# ✅ Get all appointments (symptoms + date + advice) for a patient
@router.get("/patient/{patient_id}", response_model=List[AppointmentResponse])
def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment)\
                     .filter(Appointment.patient_id == patient_id)\
                     .order_by(Appointment.date.desc())\
                     .all()
    
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this patient")
    
    return appointments
