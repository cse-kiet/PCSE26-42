#!/usr/bin/env python3
"""
Script to recreate the database with the correct schema
"""
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import Base, engine
from app.models.models import User, PatientProfile, DoctorProfile, RoleEnum

def recreate_database():
    """Recreate the database with all tables"""
    print("🗑️  Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("🏗️  Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database recreated successfully!")
    print("📊 Tables created:")
    print("   - users")
    print("   - patients") 
    print("   - doctors")
    print("   - doctor_patient")

if __name__ == "__main__":
    recreate_database()
