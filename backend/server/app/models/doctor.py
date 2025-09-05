# app/models/doctor.py
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.patient import PatientProfile

DoctorPatient = Table(
    "doctor_patient",
    Base.metadata,
    Column("doctor_id", Integer, ForeignKey("doctors.id"), primary_key=True),
    Column("patient_id", Integer, ForeignKey("patients.id"), primary_key=True)
)

class DoctorProfile(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    experience = Column(String(50), nullable=True)
    hospital = Column(String(100), nullable=True)
    specialization = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    profile_image = Column(String(255), nullable=True)
    avatar = Column(String(255), nullable=True)
   

    user = relationship("User", back_populates="doctor_profile")
    patients = relationship("PatientProfile", secondary=DoctorPatient, back_populates="doctors")
