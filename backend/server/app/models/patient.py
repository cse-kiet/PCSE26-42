# app/models/patient.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class PatientProfile(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    blood_group = Column(String(20), nullable=True)
    medical_history = Column(String(20), nullable=True)
    profile_image = Column(String(255), nullable=True)
    avatar = Column(String(255), nullable=True)
    user = relationship("User", back_populates="patient_profile")
    doctors = relationship("DoctorProfile", secondary="doctor_patient", back_populates="patients")
