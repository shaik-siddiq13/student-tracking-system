from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import text

from database import engine


SECRET_KEY = "change-this-secret-key-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def authenticate_user(username: str, password: str):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT user_id, username, password_hash, role, is_active
                FROM users
                WHERE username = :username
            """),
            {"username": username}
        )

        user = result.mappings().first()

    if not user:
        return None

    if not user["is_active"]:
        return None

    if not pwd_context.verify(password, user["password_hash"]):
        return None

    return user


def create_access_token(user_id: int, username: str, role: str):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )