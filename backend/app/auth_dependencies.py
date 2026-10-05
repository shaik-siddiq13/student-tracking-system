from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.auth import SECRET_KEY, ALGORITHM


# =========================================================
# HTTP BEARER SECURITY
# =========================================================

security = HTTPBearer()


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")
        username = payload.get("username")
        role = payload.get("role")

        if not user_id or not username or not role:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return {
            "user_id": user_id,
            "username": username,
            "role": role
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )