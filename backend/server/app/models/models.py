from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Table,DateTime
from sqlalchemy.orm import relationship
from app.models.database import Base
from datetime import datetime
import enum

class RoleEnum(str, enum.Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"

# Association table
DoctorPatient = Table(
    "doctor_patient",
    Base.metadata,
    Column("doctor_id", Integer, ForeignKey("doctors.id"), primary_key=True),
    Column("patient_id", Integer, ForeignKey("patients.id"), primary_key=True)
)

# Users table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(150), nullable=True)
    email = Column(String(150), unique=True, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    password = Column(String(255), nullable=False)


# Patients table
class PatientProfile(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    blood_group=Column(String(10),nullable=True)
    medical_history=Column(String(255),nullable=True)
    profile_image=Column(String(255),nullable=True)
    avatar=Column(String(255),nullable=True)

# Doctors table
class DoctorProfile(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    specialization = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    experience=Column(String(50),nullable=True)
    hospital=Column(String(150),nullable=True)
    profile_image=Column(String(255),nullable=True)
    avatar=Column(String(255),nullable=True)

