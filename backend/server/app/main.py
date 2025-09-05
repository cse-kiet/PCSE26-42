# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


# import routers
from app.routes import auth, doctor, patient, predict, users,profile,appointment

from app.models.database import Base, engine


# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EmoHealth Nexus API")


# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")




# ✅ Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(doctor.router, prefix="/doctor", tags=["Doctor"])
app.include_router(patient.router, prefix="/patient", tags=["Patient"])
app.include_router(predict.router, prefix="/predict", tags=["Predict"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(predict.router, prefix="/api")
app.include_router(appointment.router, prefix="/appointments", tags=["Appointments"])