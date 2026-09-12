import os 
from datetime import datetime, timedelta

from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user_model import User

load_dotenv()
    
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    token_data = data.copy()
    expire_time = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data.update({"exp": expire_time})  # ← was broken before
    return jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)  # ← was missing

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login") 

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    db_user = db.query(User).filter(User.username == username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    return db_user

# =========================================
# EN: Block write operations for demo users
# JP: デモユーザーの書き込み操作を禁止
#
# Demo users can explore production data,
# but cannot create, update, or delete it.
# =========================================

def require_write_access(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role == "demo":
        raise HTTPException(
            status_code=403,
            detail="Demo account is read-only"
        )

    return current_user