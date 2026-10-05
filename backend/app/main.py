from fastapi import Depends, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from database import engine
from auth import authenticate_user, create_access_token
from auth_dependencies import get_current_user

from student import router as student_router
from admin import router as admin_router
from notifications import router as notifications_router


app = FastAPI(
    title="Student Tracking System",
    description="Student interview, company and performance tracking system",
    version="1.0.0"
)


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# ROUTERS
# ==============================

app.include_router(student_router)
app.include_router(admin_router)
app.include_router(notifications_router)


# ==============================
# LOGIN MODEL
# ==============================

class LoginRequest(BaseModel):
    username: str
    password: str


# ==============================
# HOME
# ==============================

@app.get("/")
def home():
    return {
        "message": "Student Tracking System API is running!"
    }


# ==============================
# HEALTH CHECK
# ==============================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ==============================
# DATABASE TEST
# ==============================

@app.get("/database-test")
def database_test():

    with engine.connect() as connection:

        result = connection.execute(
            text("SELECT 1")
        )

        value = result.scalar()

    return {
        "database": "connected",
        "test_result": value
    }


# ==============================
# LOGIN
# ==============================

@app.post("/login")
def login(request: LoginRequest):

    user = authenticate_user(
        request.username,
        request.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        user_id=user["user_id"],
        username=user["username"],
        role=user["role"]
    )

    return {
        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "user_id": user["user_id"],
            "username": user["username"],
            "role": user["role"]
        }
    }


# ==============================
# CURRENT USER
# ==============================

@app.get("/me")
def get_my_account(
    current_user=Depends(get_current_user)
):

    return {
        "message": "You are authenticated",
        "user": current_user
    }