from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.database import get_db
from app.models.models import User, RoleEnum
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------- Current User ----------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    print("👉 Raw token received:", token, flush=True)
    payload = decode_access_token(token)
    if payload is None:
        print(payload)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------- Current Patient ----------------
def get_current_patient(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != RoleEnum.PATIENT:
        raise HTTPException(status_code=403, detail="Not a patient account")
    return current_user


# ---------------- Current Doctor ----------------
from fastapi import Header

def get_current_doctor(
    current_user: User = Depends(get_current_user),
    authorization: str = Header(None)
) -> User:
    print("Raw token from frontend:", authorization, flush=True)
    print("Decoded user:", current_user.id, current_user.role, flush=True)

    if current_user.role != RoleEnum.DOCTOR:
        raise HTTPException(status_code=403, detail="Not a doctor account")
    return current_user
