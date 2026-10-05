from fastapi import Depends, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from app.database import engine
from app.auth import authenticate_user, create_access_token
from app.auth_dependencies import get_current_user
from app.student import router as student_router
from app.admin import router as admin_router
from app.notifications import router as notifications_router


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="TTT NexGen Tracker",
    description="Student Career & Placement Intelligence Platform",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ttt-nexgen-tracker.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOGIN REQUEST MODEL
# =========================================================

class LoginRequest(BaseModel):
    username: str
    password: str


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():
    return {
        "message": "TTT NexGen Tracker API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(login_data: LoginRequest):

    user = authenticate_user(
        login_data.username,
        login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        user["user_id"],
        user["username"],
        user["role"]
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# =========================================================
# CURRENT USER
# =========================================================

@app.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user


# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    student_router
)

app.include_router(
    admin_router
)

app.include_router(
    notifications_router
)