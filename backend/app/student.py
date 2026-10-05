from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import text

from app.database import engine
from app.auth_dependencies import get_current_user


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# =========================================================
# STUDENT PROFILE
# =========================================================

class StudentProfile(BaseModel):
    first_name: str
    last_name: str | None = None
    email: EmailStr
    phone: str | None = None
    date_of_birth: str | None = None
    gender: str | None = None
    qualification: str | None = None
    college_name: str | None = None
    graduation_year: int | None = None
    bio: str | None = None


@router.post("/profile")
def create_or_update_student_profile(
    profile: StudentProfile,
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # Check whether this user already has a student profile
    with engine.connect() as connection:
        existing = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).first()

    # =====================================================
    # UPDATE EXISTING PROFILE
    # =====================================================

    if existing:
        student_id = existing[0]

        with engine.begin() as connection:
            connection.execute(
                text("""
                    UPDATE students
                    SET
                        first_name = :first_name,
                        last_name = :last_name,
                        email = :email,
                        phone = :phone,
                        date_of_birth = :date_of_birth,
                        gender = :gender,
                        qualification = :qualification,
                        college_name = :college_name,
                        graduation_year = :graduation_year,
                        bio = :bio
                    WHERE student_id = :student_id
                """),
                {
                    "student_id": student_id,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "email": profile.email,
                    "phone": profile.phone,
                    "date_of_birth": profile.date_of_birth,
                    "gender": profile.gender,
                    "qualification": profile.qualification,
                    "college_name": profile.college_name,
                    "graduation_year": profile.graduation_year,
                    "bio": profile.bio
                }
            )

        # Get updated profile
        with engine.connect() as connection:
            result = connection.execute(
                text("""
                    SELECT
                        s.student_id,
                        s.first_name,
                        s.last_name,
                        s.email,
                        s.phone,
                        s.date_of_birth,
                        s.gender,
                        s.qualification,
                        s.college_name,
                        s.graduation_year,
                        s.profile_photo,
                        s.current_status,
                        s.bio,
                        b.batch_name,
                        b.course_name
                    FROM students s
                    JOIN batches b
                        ON s.batch_id = b.batch_id
                    WHERE s.student_id = :student_id
                """),
                {"student_id": student_id}
            )

            updated_student = result.mappings().first()

        return {
            "message": "Student profile updated successfully",
            "student": dict(updated_student)
        }

    # =====================================================
    # CREATE NEW PROFILE
    # =====================================================

    batch_id = 1

    with engine.begin() as connection:
        result = connection.execute(
            text("""
                INSERT INTO students
                (
                    user_id,
                    batch_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    date_of_birth,
                    gender,
                    qualification,
                    college_name,
                    graduation_year,
                    bio
                )
                VALUES
                (
                    :user_id,
                    :batch_id,
                    :first_name,
                    :last_name,
                    :email,
                    :phone,
                    :date_of_birth,
                    :gender,
                    :qualification,
                    :college_name,
                    :graduation_year,
                    :bio
                )
                RETURNING student_id
            """),
            {
                "user_id": user_id,
                "batch_id": batch_id,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "email": profile.email,
                "phone": profile.phone,
                "date_of_birth": profile.date_of_birth,
                "gender": profile.gender,
                "qualification": profile.qualification,
                "college_name": profile.college_name,
                "graduation_year": profile.graduation_year,
                "bio": profile.bio
            }
        )

        student_id = result.scalar_one()

    return {
        "message": "Student profile created successfully",
        "student_id": student_id,
        "user_id": user_id,
        "batch_id": batch_id
    }


# =========================================================
# GET MY PROFILE
# =========================================================

@router.get("/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.phone,
                    s.date_of_birth,
                    s.gender,
                    s.qualification,
                    s.college_name,
                    s.graduation_year,
                    s.profile_photo,
                    s.current_status,
                    s.bio,
                    b.batch_name,
                    b.course_name
                FROM students s
                JOIN batches b
                    ON s.batch_id = b.batch_id
                WHERE s.user_id = :user_id
            """),
            {"user_id": user_id}
        )

        student = result.mappings().first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    return {
        "student": dict(student)
    }


# =========================================================
# STUDENT DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_student_dashboard(
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    with engine.connect() as connection:

        # -------------------------------------------------
        # Student information
        # -------------------------------------------------

        student_result = connection.execute(
            text("""
                SELECT
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.current_status,
                    b.batch_name,
                    b.course_name,
                    s.qualification,
                    s.graduation_year
                FROM students s
                JOIN batches b
                    ON s.batch_id = b.batch_id
                WHERE s.user_id = :user_id
            """),
            {"user_id": user_id}
        )

        student = student_result.mappings().first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found"
            )

        student_id = student["student_id"]

        # -------------------------------------------------
        # Interview statistics
        # -------------------------------------------------

        interview_result = connection.execute(
            text("""
                SELECT
                    COUNT(*) AS total_interviews,

                    COUNT(*) FILTER (
                        WHERE status = 'SCHEDULED'
                    ) AS scheduled_interviews,

                    COUNT(*) FILTER (
                        WHERE status = 'COMPLETED'
                    ) AS completed_interviews,

                    COUNT(*) FILTER (
                        WHERE result = 'SELECTED'
                    ) AS selected_interviews

                FROM interviews
                WHERE student_id = :student_id
            """),
            {"student_id": student_id}
        )

        interviews = interview_result.mappings().first()

        # -------------------------------------------------
        # Employment information
        # -------------------------------------------------

        employment_result = connection.execute(
            text("""
                SELECT
                    employment_id,
                    company_name,
                    role,
                    employment_type,
                    start_date,
                    end_date,
                    is_current,
                    salary,
                    location
                FROM employment_history
                WHERE student_id = :student_id
                ORDER BY start_date DESC
            """),
            {"student_id": student_id}
        )

        employment = [
            dict(row)
            for row in employment_result.mappings().all()
        ]

        # -------------------------------------------------
        # Performance
        # -------------------------------------------------

        performance_result = connection.execute(
            text("""
                SELECT
                    python_score,
                    sql_score,
                    pyspark_score,
                    aws_score,
                    data_engineering_score,
                    communication_score,
                    overall_score,
                    assessment_count,
                    mock_interview_count
                FROM student_performance
                WHERE student_id = :student_id
            """),
            {"student_id": student_id}
        )

        performance = performance_result.mappings().first()

        return {
            "student": dict(student),

            "interviews": dict(interviews),

            "employment": employment,

            "performance": (
                dict(performance)
                if performance
                else None
            )
        }


# =========================================================
# COMPANIES
# =========================================================

@router.get("/companies")
def get_companies(
    current_user=Depends(get_current_user)
):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    company_id,
                    company_name,
                    industry,
                    location,
                    website
                FROM companies
                ORDER BY company_name
            """)
        )

        companies = result.mappings().all()

    return {
        "companies": [
            dict(company)
            for company in companies
        ]
    }


# =========================================================
# COMPANY CONTACTS
# =========================================================

@router.get("/company-contacts/{company_id}")
def get_company_contacts(
    company_id: int,
    current_user=Depends(get_current_user)
):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    contact_id,
                    company_id,
                    contact_name,
                    designation,
                    email,
                    phone
                FROM company_contacts
                WHERE company_id = :company_id
                ORDER BY contact_name
            """),
            {
                "company_id": company_id
            }
        )

        contacts = result.mappings().all()

    return {
        "contacts": [
            dict(contact)
            for contact in contacts
        ]
    }


# =========================================================
# CREATE INTERVIEW
# =========================================================

class InterviewCreate(BaseModel):
    company_id: int
    contact_id: int | None = None
    interview_date: str
    role: str
    interview_type: str | None = None
    current_round: str | None = None
    status: str = "SCHEDULED"
    result: str | None = None
    expected_salary: float | None = None
    remarks: str | None = None


@router.post("/interviews")
def create_interview(
    interview: InterviewCreate,
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # -----------------------------------------------------
    # Find logged-in student's student_id
    # -----------------------------------------------------

    with engine.connect() as connection:
        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).mappings().first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    student_id = student["student_id"]

    # -----------------------------------------------------
    # Check company
    # -----------------------------------------------------

    with engine.connect() as connection:
        company = connection.execute(
            text("""
                SELECT
                    company_id,
                    company_name
                FROM companies
                WHERE company_id = :company_id
            """),
            {"company_id": interview.company_id}
        ).mappings().first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    # -----------------------------------------------------
    # Check contact
    # -----------------------------------------------------

    if interview.contact_id is not None:

        with engine.connect() as connection:
            contact = connection.execute(
                text("""
                    SELECT contact_id
                    FROM company_contacts
                    WHERE contact_id = :contact_id
                      AND company_id = :company_id
                """),
                {
                    "contact_id": interview.contact_id,
                    "company_id": interview.company_id
                }
            ).first()

        if not contact:
            raise HTTPException(
                status_code=400,
                detail="Contact does not belong to the selected company"
            )

    # -----------------------------------------------------
    # Insert interview
    # -----------------------------------------------------

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                INSERT INTO interviews
                (
                    student_id,
                    company_id,
                    contact_id,
                    interview_date,
                    role,
                    interview_type,
                    current_round,
                    status,
                    result,
                    expected_salary,
                    remarks
                )
                VALUES
                (
                    :student_id,
                    :company_id,
                    :contact_id,
                    :interview_date,
                    :role,
                    :interview_type,
                    :current_round,
                    :status,
                    :result,
                    :expected_salary,
                    :remarks
                )
                RETURNING interview_id
            """),
            {
                "student_id": student_id,
                "company_id": interview.company_id,
                "contact_id": interview.contact_id,
                "interview_date": interview.interview_date,
                "role": interview.role,
                "interview_type": interview.interview_type,
                "current_round": interview.current_round,
                "status": interview.status,
                "result": interview.result,
                "expected_salary": interview.expected_salary,
                "remarks": interview.remarks
            }
        )

        interview_id = result.scalar_one()

    return {
        "message": "Interview created successfully",
        "interview_id": interview_id
    }


# =========================================================
# GET MY INTERVIEWS
# =========================================================

@router.get("/interviews")
def get_my_interviews(
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # -----------------------------------------------------
    # Find logged-in student's student_id
    # -----------------------------------------------------

    with engine.connect() as connection:
        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).mappings().first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    student_id = student["student_id"]

    # -----------------------------------------------------
    # Get student's interviews
    # -----------------------------------------------------

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    i.interview_id,
                    i.interview_date,
                    i.role,
                    i.interview_type,
                    i.current_round,
                    i.status,
                    i.result,
                    i.expected_salary,
                    i.remarks,

                    c.company_id,
                    c.company_name,
                    c.industry,
                    c.location,
                    c.website,

                    cc.contact_id,
                    cc.contact_name,
                    cc.designation,
                    cc.email AS contact_email,
                    cc.phone AS contact_phone

                FROM interviews i

                JOIN companies c
                    ON i.company_id = c.company_id

                LEFT JOIN company_contacts cc
                    ON i.contact_id = cc.contact_id

                WHERE i.student_id = :student_id

                ORDER BY i.interview_date DESC,
                         i.interview_id DESC
            """),
            {
                "student_id": student_id
            }
        )

        interviews = result.mappings().all()

    return {
        "interviews": [
            dict(interview)
            for interview in interviews
        ]
    }


# =========================================================
# UPDATE INTERVIEW
# =========================================================

class InterviewUpdate(BaseModel):
    company_id: int
    contact_id: int | None = None
    interview_date: str
    role: str
    interview_type: str | None = None
    current_round: str | None = None
    status: str
    result: str | None = None
    expected_salary: float | None = None
    remarks: str | None = None


@router.put("/interviews/{interview_id}")
def update_interview(
    interview_id: int,
    interview: InterviewUpdate,
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # -----------------------------------------------------
    # Find logged-in student's student_id
    # -----------------------------------------------------

    with engine.connect() as connection:
        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {
                "user_id": user_id
            }
        ).mappings().first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    student_id = student["student_id"]

    # -----------------------------------------------------
    # Check whether interview belongs to this student
    # -----------------------------------------------------

    with engine.connect() as connection:
        existing_interview = connection.execute(
            text("""
                SELECT interview_id
                FROM interviews
                WHERE interview_id = :interview_id
                  AND student_id = :student_id
            """),
            {
                "interview_id": interview_id,
                "student_id": student_id
            }
        ).first()

    if not existing_interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # -----------------------------------------------------
    # Check company
    # -----------------------------------------------------

    with engine.connect() as connection:
        company = connection.execute(
            text("""
                SELECT company_id
                FROM companies
                WHERE company_id = :company_id
            """),
            {
                "company_id": interview.company_id
            }
        ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    # -----------------------------------------------------
    # Check contact
    # -----------------------------------------------------

    if interview.contact_id is not None:

        with engine.connect() as connection:
            contact = connection.execute(
                text("""
                    SELECT contact_id
                    FROM company_contacts
                    WHERE contact_id = :contact_id
                      AND company_id = :company_id
                """),
                {
                    "contact_id": interview.contact_id,
                    "company_id": interview.company_id
                }
            ).first()

        if not contact:
            raise HTTPException(
                status_code=400,
                detail="Contact does not belong to the selected company"
            )

    # -----------------------------------------------------
    # Update interview
    # -----------------------------------------------------

    with engine.begin() as connection:

        connection.execute(
            text("""
                UPDATE interviews
                SET
                    company_id = :company_id,
                    contact_id = :contact_id,
                    interview_date = :interview_date,
                    role = :role,
                    interview_type = :interview_type,
                    current_round = :current_round,
                    status = :status,
                    result = :result,
                    expected_salary = :expected_salary,
                    remarks = :remarks
                WHERE interview_id = :interview_id
                  AND student_id = :student_id
            """),
            {
                "interview_id": interview_id,
                "student_id": student_id,
                "company_id": interview.company_id,
                "contact_id": interview.contact_id,
                "interview_date": interview.interview_date,
                "role": interview.role,
                "interview_type": interview.interview_type,
                "current_round": interview.current_round,
                "status": interview.status,
                "result": interview.result,
                "expected_salary": interview.expected_salary,
                "remarks": interview.remarks
            }
        )

    return {
        "message": "Interview updated successfully",
        "interview_id": interview_id
    }


# =========================================================
# DELETE INTERVIEW
# =========================================================

@router.delete("/interviews/{interview_id}")
def delete_interview(
    interview_id: int,
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # -----------------------------------------------------
    # Find logged-in student's student_id
    # -----------------------------------------------------

    with engine.connect() as connection:
        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {
                "user_id": user_id
            }
        ).mappings().first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    student_id = student["student_id"]

    # -----------------------------------------------------
    # Check whether interview belongs to this student
    # -----------------------------------------------------

    with engine.connect() as connection:
        existing_interview = connection.execute(
            text("""
                SELECT interview_id
                FROM interviews
                WHERE interview_id = :interview_id
                  AND student_id = :student_id
            """),
            {
                "interview_id": interview_id,
                "student_id": student_id
            }
        ).first()

    if not existing_interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # -----------------------------------------------------
    # Delete interview
    # -----------------------------------------------------

    with engine.begin() as connection:
        connection.execute(
            text("""
                DELETE FROM interviews
                WHERE interview_id = :interview_id
                  AND student_id = :student_id
            """),
            {
                "interview_id": interview_id,
                "student_id": student_id
            }
        )

    return {
        "message": "Interview deleted successfully",
        "interview_id": interview_id
    }