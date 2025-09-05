from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base



class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"))
    patient_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    recommendation = Column(Text, nullable=True)  # ✅ doctor’s advice
   
    response_date = Column(DateTime, nullable=True)

    # doctor aur patient dono User table se linked hain
    doctor = relationship("User", foreign_keys=[doctor_id])
    patient = relationship("User", foreign_keys=[patient_id])
