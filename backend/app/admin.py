from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from app.database import engine
from app.auth_dependencies import get_current_user


# =========================================================
# ADMIN ROUTER
# =========================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# =========================================================
# HELPER - ADMIN ACCESS
# =========================================================

def check_admin(current_user):
    if current_user["role"] != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


# =========================================================
# COMPANY CREATE MODEL
# =========================================================

class CompanyCreate(BaseModel):
    company_name: str
    industry: str | None = None
    location: str | None = None
    website: str | None = None
    description: str | None = None


# =========================================================
# CREATE COMPANY
# =========================================================

@router.post("/companies")
def create_company(
    company: CompanyCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        existing = connection.execute(
            text("""
                SELECT company_id
                FROM companies
                WHERE LOWER(company_name) = LOWER(:company_name)
            """),
            {
                "company_name": company.company_name
            }
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Company already exists"
            )

        result = connection.execute(
            text("""
                INSERT INTO companies
                (
                    company_name,
                    industry,
                    location,
                    website,
                    description
                )
                VALUES
                (
                    :company_name,
                    :industry,
                    :location,
                    :website,
                    :description
                )
                RETURNING company_id
            """),
            {
                "company_name": company.company_name,
                "industry": company.industry,
                "location": company.location,
                "website": company.website,
                "description": company.description
            }
        )

        company_id = result.scalar_one()

    return {
        "message": "Company created successfully",
        "company_id": company_id
    }


# =========================================================
# ADMIN - GET ALL COMPANIES
# =========================================================

@router.get("/companies")
def get_all_companies(
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    company_id,
                    company_name,
                    industry,
                    location,
                    website,
                    description
                FROM companies
                ORDER BY company_name ASC
            """)
        )

        companies = [
            dict(row)
            for row in result.mappings().all()
        ]

    return {
        "companies": companies
    }


# =========================================================
# COMPANY CONTACT CREATE MODEL
# =========================================================

class CompanyContactCreate(BaseModel):
    company_id: int
    contact_name: str
    designation: str | None = None
    email: str | None = None
    phone: str | None = None
    linkedin_url: str | None = None
    notes: str | None = None


# =========================================================
# CREATE COMPANY CONTACT
# =========================================================

@router.post("/company-contacts")
def create_company_contact(
    contact: CompanyContactCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        company = connection.execute(
            text("""
                SELECT company_id
                FROM companies
                WHERE company_id = :company_id
            """),
            {
                "company_id": contact.company_id
            }
        ).first()

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found"
            )

        result = connection.execute(
            text("""
                INSERT INTO company_contacts
                (
                    company_id,
                    contact_name,
                    designation,
                    email,
                    phone,
                    linkedin_url,
                    notes
                )
                VALUES
                (
                    :company_id,
                    :contact_name,
                    :designation,
                    :email,
                    :phone,
                    :linkedin_url,
                    :notes
                )
                RETURNING contact_id
            """),
            {
                "company_id": contact.company_id,
                "contact_name": contact.contact_name,
                "designation": contact.designation,
                "email": contact.email,
                "phone": contact.phone,
                "linkedin_url": contact.linkedin_url,
                "notes": contact.notes
            }
        )

        contact_id = result.scalar_one()

    return {
        "message": "Company contact created successfully",
        "contact_id": contact_id
    }


# =========================================================
# PERFORMANCE CREATE MODEL
# =========================================================

class PerformanceCreate(BaseModel):
    student_id: int
    python_score: float | None = None
    sql_score: float | None = None
    pyspark_score: float | None = None
    aws_score: float | None = None
    data_engineering_score: float | None = None
    communication_score: float | None = None
    overall_score: float | None = None
    assessment_count: int = 0
    mock_interview_count: int = 0


# =========================================================
# CREATE / UPDATE STUDENT PERFORMANCE
# =========================================================

@router.post("/student-performance")
def create_or_update_performance(
    performance: PerformanceCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        # -------------------------------------------------
        # CHECK STUDENT
        # -------------------------------------------------

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": performance.student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # -------------------------------------------------
        # CHECK EXISTING PERFORMANCE
        # -------------------------------------------------

        existing = connection.execute(
            text("""
                SELECT performance_id
                FROM student_performance
                WHERE student_id = :student_id
            """),
            {
                "student_id": performance.student_id
            }
        ).first()

        # -------------------------------------------------
        # UPDATE EXISTING PERFORMANCE
        # -------------------------------------------------

        if existing:

            connection.execute(
                text("""
                    UPDATE student_performance
                    SET
                        python_score = :python_score,
                        sql_score = :sql_score,
                        pyspark_score = :pyspark_score,
                        aws_score = :aws_score,
                        data_engineering_score = :data_engineering_score,
                        communication_score = :communication_score,
                        overall_score = :overall_score,
                        assessment_count = :assessment_count,
                        mock_interview_count = :mock_interview_count,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE student_id = :student_id
                """),
                {
                    "student_id": performance.student_id,
                    "python_score": performance.python_score,
                    "sql_score": performance.sql_score,
                    "pyspark_score": performance.pyspark_score,
                    "aws_score": performance.aws_score,
                    "data_engineering_score": performance.data_engineering_score,
                    "communication_score": performance.communication_score,
                    "overall_score": performance.overall_score,
                    "assessment_count": performance.assessment_count,
                    "mock_interview_count": performance.mock_interview_count
                }
            )

            return {
                "message": "Student performance updated successfully",
                "student_id": performance.student_id
            }

        # -------------------------------------------------
        # CREATE NEW PERFORMANCE
        # -------------------------------------------------

        result = connection.execute(
            text("""
                INSERT INTO student_performance
                (
                    student_id,
                    python_score,
                    sql_score,
                    pyspark_score,
                    aws_score,
                    data_engineering_score,
                    communication_score,
                    overall_score,
                    assessment_count,
                    mock_interview_count
                )
                VALUES
                (
                    :student_id,
                    :python_score,
                    :sql_score,
                    :pyspark_score,
                    :aws_score,
                    :data_engineering_score,
                    :communication_score,
                    :overall_score,
                    :assessment_count,
                    :mock_interview_count
                )
                RETURNING performance_id
            """),
            {
                "student_id": performance.student_id,
                "python_score": performance.python_score,
                "sql_score": performance.sql_score,
                "pyspark_score": performance.pyspark_score,
                "aws_score": performance.aws_score,
                "data_engineering_score": performance.data_engineering_score,
                "communication_score": performance.communication_score,
                "overall_score": performance.overall_score,
                "assessment_count": performance.assessment_count,
                "mock_interview_count": performance.mock_interview_count
            }
        )

        performance_id = result.scalar_one()

    return {
        "message": "Student performance created successfully",
        "performance_id": performance_id,
        "student_id": performance.student_id
    }


# =========================================================
# UPDATE STUDENT PERFORMANCE
# =========================================================

@router.put("/student-performance/{student_id}")
def update_student_performance(
    student_id: int,
    performance: PerformanceCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        existing = connection.execute(
            text("""
                SELECT performance_id
                FROM student_performance
                WHERE student_id = :student_id
            """),
            {
                "student_id": student_id
            }
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Performance record not found"
            )

        connection.execute(
            text("""
                UPDATE student_performance
                SET
                    python_score = :python_score,
                    sql_score = :sql_score,
                    pyspark_score = :pyspark_score,
                    aws_score = :aws_score,
                    data_engineering_score = :data_engineering_score,
                    communication_score = :communication_score,
                    overall_score = :overall_score,
                    assessment_count = :assessment_count,
                    mock_interview_count = :mock_interview_count,
                    updated_at = CURRENT_TIMESTAMP
                WHERE student_id = :student_id
            """),
            {
                "student_id": student_id,
                "python_score": performance.python_score,
                "sql_score": performance.sql_score,
                "pyspark_score": performance.pyspark_score,
                "aws_score": performance.aws_score,
                "data_engineering_score": performance.data_engineering_score,
                "communication_score": performance.communication_score,
                "overall_score": performance.overall_score,
                "assessment_count": performance.assessment_count,
                "mock_interview_count": performance.mock_interview_count
            }
        )

    return {
        "message": "Student performance updated successfully",
        "student_id": student_id
    }


# =========================================================
# STUDENT PROFILE UPDATE MODEL
# =========================================================

class StudentProfileUpdate(BaseModel):
    first_name: str
    last_name: str | None = None
    email: str
    phone: str | None = None
    date_of_birth: str | None = None
    gender: str | None = None
    qualification: str | None = None
    college_name: str | None = None
    graduation_year: int | None = None
    bio: str | None = None
    current_status: str | None = None


# =========================================================
# ADMIN - UPDATE STUDENT PROFILE
# =========================================================

@router.put("/students/{student_id}/profile")
def update_student_profile(
    student_id: int,
    profile: StudentProfileUpdate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        # -------------------------------------------------
        # CHECK STUDENT
        # -------------------------------------------------

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # -------------------------------------------------
        # UPDATE PROFILE
        # -------------------------------------------------

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
                    bio = :bio,
                    current_status = :current_status,
                    updated_at = CURRENT_TIMESTAMP
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
                "bio": profile.bio,
                "current_status": profile.current_status
            }
        )

    return {
        "message": "Student profile updated successfully",
        "student_id": student_id
    }


# =========================================================
# EMPLOYMENT CREATE / UPDATE MODEL
# =========================================================

class EmploymentCreate(BaseModel):
    student_id: int
    company_id: int | None = None
    company_name: str
    role: str
    employment_type: str | None = None
    start_date: str
    end_date: str | None = None
    is_current: bool = False
    salary: float | None = None
    location: str | None = None
    remarks: str | None = None


# =========================================================
# CREATE EMPLOYMENT
# =========================================================

@router.post("/employment")
def create_employment(
    employment: EmploymentCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": employment.student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        if employment.company_id is not None:

            company = connection.execute(
                text("""
                    SELECT company_id
                    FROM companies
                    WHERE company_id = :company_id
                """),
                {
                    "company_id": employment.company_id
                }
            ).first()

            if not company:
                raise HTTPException(
                    status_code=404,
                    detail="Company not found"
                )

        result = connection.execute(
            text("""
                INSERT INTO employment_history
                (
                    student_id,
                    company_id,
                    company_name,
                    role,
                    employment_type,
                    start_date,
                    end_date,
                    is_current,
                    salary,
                    location,
                    remarks
                )
                VALUES
                (
                    :student_id,
                    :company_id,
                    :company_name,
                    :role,
                    :employment_type,
                    :start_date,
                    :end_date,
                    :is_current,
                    :salary,
                    :location,
                    :remarks
                )
                RETURNING employment_id
            """),
            {
                "student_id": employment.student_id,
                "company_id": employment.company_id,
                "company_name": employment.company_name,
                "role": employment.role,
                "employment_type": employment.employment_type,
                "start_date": employment.start_date,
                "end_date": employment.end_date,
                "is_current": employment.is_current,
                "salary": employment.salary,
                "location": employment.location,
                "remarks": employment.remarks
            }
        )

        employment_id = result.scalar_one()

    return {
        "message": "Employment history created successfully",
        "employment_id": employment_id,
        "student_id": employment.student_id
    }


# =========================================================
# UPDATE EMPLOYMENT
# =========================================================

@router.put("/employment/{employment_id}")
def update_employment(
    employment_id: int,
    employment: EmploymentCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        existing = connection.execute(
            text("""
                SELECT employment_id
                FROM employment_history
                WHERE employment_id = :employment_id
            """),
            {
                "employment_id": employment_id
            }
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Employment record not found"
            )

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": employment.student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        if employment.company_id is not None:

            company = connection.execute(
                text("""
                    SELECT company_id
                    FROM companies
                    WHERE company_id = :company_id
                """),
                {
                    "company_id": employment.company_id
                }
            ).first()

            if not company:
                raise HTTPException(
                    status_code=404,
                    detail="Company not found"
                )

        connection.execute(
            text("""
                UPDATE employment_history
                SET
                    student_id = :student_id,
                    company_id = :company_id,
                    company_name = :company_name,
                    role = :role,
                    employment_type = :employment_type,
                    start_date = :start_date,
                    end_date = :end_date,
                    is_current = :is_current,
                    salary = :salary,
                    location = :location,
                    remarks = :remarks
                WHERE employment_id = :employment_id
            """),
            {
                "employment_id": employment_id,
                "student_id": employment.student_id,
                "company_id": employment.company_id,
                "company_name": employment.company_name,
                "role": employment.role,
                "employment_type": employment.employment_type,
                "start_date": employment.start_date,
                "end_date": employment.end_date,
                "is_current": employment.is_current,
                "salary": employment.salary,
                "location": employment.location,
                "remarks": employment.remarks
            }
        )

    return {
        "message": "Employment history updated successfully",
        "employment_id": employment_id,
        "student_id": employment.student_id
    }


# =========================================================
# DELETE EMPLOYMENT
# =========================================================

@router.delete("/employment/{employment_id}")
def delete_employment(
    employment_id: int,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        existing = connection.execute(
            text("""
                SELECT employment_id
                FROM employment_history
                WHERE employment_id = :employment_id
            """),
            {
                "employment_id": employment_id
            }
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Employment record not found"
            )

        connection.execute(
            text("""
                DELETE FROM employment_history
                WHERE employment_id = :employment_id
            """),
            {
                "employment_id": employment_id
            }
        )

    return {
        "message": "Employment history deleted successfully",
        "employment_id": employment_id
    }


# =========================================================
# INTERVIEW CREATE / UPDATE MODEL
# =========================================================

class InterviewCreate(BaseModel):
    student_id: int
    company_id: int
    contact_id: int | None = None
    role: str
    interview_date: str
    interview_type: str
    current_round: str
    status: str
    result: str | None = None
    expected_salary: float | None = None
    location: str | None = None
    remarks: str | None = None


# =========================================================
# CREATE INTERVIEW
# =========================================================

@router.post("/interviews")
def create_interview(
    interview: InterviewCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": interview.student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

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

        if interview.contact_id is not None:

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
                    status_code=404,
                    detail="Company contact not found"
                )

        result = connection.execute(
            text("""
                INSERT INTO interviews
                (
                    student_id,
                    company_id,
                    contact_id,
                    role,
                    interview_date,
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
                    :role,
                    :interview_date,
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
                "student_id": interview.student_id,
                "company_id": interview.company_id,
                "contact_id": interview.contact_id,
                "role": interview.role,
                "interview_date": interview.interview_date,
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
        "interview_id": interview_id,
        "student_id": interview.student_id
    }


# =========================================================
# UPDATE INTERVIEW
# =========================================================

@router.put("/interviews/{interview_id}")
def update_interview(
    interview_id: int,
    interview: InterviewCreate,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.begin() as connection:

        existing = connection.execute(
            text("""
                SELECT interview_id
                FROM interviews
                WHERE interview_id = :interview_id
            """),
            {
                "interview_id": interview_id
            }
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Interview not found"
            )

        student = connection.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE student_id = :student_id
            """),
            {
                "student_id": interview.student_id
            }
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

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

        if interview.contact_id is not None:

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
                    status_code=404,
                    detail="Company contact not found"
                )

        connection.execute(
            text("""
                UPDATE interviews
                SET
                    student_id = :student_id,
                    company_id = :company_id,
                    contact_id = :contact_id,
                    role = :role,
                    interview_date = :interview_date,
                    interview_type = :interview_type,
                    current_round = :current_round,
                    status = :status,
                    result = :result,
                    expected_salary = :expected_salary,
                    remarks = :remarks,
                    updated_at = CURRENT_TIMESTAMP
                WHERE interview_id = :interview_id
            """),
            {
                "interview_id": interview_id,
                "student_id": interview.student_id,
                "company_id": interview.company_id,
                "contact_id": interview.contact_id,
                "role": interview.role,
                "interview_date": interview.interview_date,
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

    check_admin(current_user)

    with engine.begin() as connection:

        existing = connection.execute(
            text("""
                SELECT interview_id
                FROM interviews
                WHERE interview_id = :interview_id
            """),
            {
                "interview_id": interview_id
            }
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Interview not found"
            )

        connection.execute(
            text("""
                DELETE FROM interviews
                WHERE interview_id = :interview_id
            """),
            {
                "interview_id": interview_id
            }
        )

    return {
        "message": "Interview deleted successfully",
        "interview_id": interview_id
    }


# =========================================================
# ADMIN - GET ALL BATCHES
# =========================================================

@router.get("/batches")
def get_admin_batches(
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    batch_id,
                    batch_name,
                    course_name
                FROM batches
                ORDER BY batch_name DESC
            """)
        )

        batches = [
            dict(row)
            for row in result.mappings().all()
        ]

    return {
        "batches": batches
    }


# =========================================================
# ADMIN - GET STUDENTS BY BATCH
# =========================================================

@router.get("/batches/{batch_id}/students")
def get_students_by_batch(
    batch_id: int,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.connect() as connection:

        batch = connection.execute(
            text("""
                SELECT
                    batch_id,
                    batch_name,
                    course_name
                FROM batches
                WHERE batch_id = :batch_id
            """),
            {
                "batch_id": batch_id
            }
        ).mappings().first()

        if not batch:
            raise HTTPException(
                status_code=404,
                detail="Batch not found"
            )

        result = connection.execute(
            text("""
                SELECT
                    s.student_id,
                    s.user_id,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.phone,
                    s.current_status,
                    s.qualification,
                    s.graduation_year,

                    b.batch_id,
                    b.batch_name,
                    b.course_name

                FROM students s

                INNER JOIN batches b
                    ON s.batch_id = b.batch_id

                WHERE s.batch_id = :batch_id

                ORDER BY
                    s.first_name,
                    s.last_name
            """),
            {
                "batch_id": batch_id
            }
        )

        students = [
            dict(row)
            for row in result.mappings().all()
        ]

    return {
        "batch": dict(batch),
        "students": students
    }


# =========================================================
# ADMIN - GET COMPLETE STUDENT DETAILS
# =========================================================

@router.get("/students/{student_id}/details")
def get_admin_student_details(
    student_id: int,
    current_user=Depends(get_current_user)
):

    check_admin(current_user)

    with engine.connect() as connection:

        # =================================================
        # STUDENT PROFILE
        # =================================================

        student = connection.execute(
            text("""
                SELECT
                    s.student_id,
                    s.user_id,
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
                    s.created_at,
                    s.updated_at,

                    b.batch_id,
                    b.batch_name,
                    b.course_name

                FROM students s

                INNER JOIN batches b
                    ON s.batch_id = b.batch_id

                WHERE s.student_id = :student_id
            """),
            {
                "student_id": student_id
            }
        ).mappings().first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # =================================================
        # PERFORMANCE
        # =================================================

        performance = connection.execute(
            text("""
                SELECT
                    performance_id,
                    student_id,
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
                ORDER BY performance_id DESC
                LIMIT 1
            """),
            {
                "student_id": student_id
            }
        ).mappings().first()

        # =================================================
        # INTERVIEWS
        # =================================================

        interviews_result = connection.execute(
            text("""
                SELECT
                    i.interview_id,
                    i.student_id,

                    i.company_id,
                    c.company_name,

                    i.contact_id,
                    cc.contact_name,
                    cc.designation,
                    cc.email AS contact_email,
                    cc.phone AS contact_phone,

                    i.role,
                    i.interview_date,
                    i.interview_type,
                    i.current_round,
                    i.status,
                    i.result,
                    i.expected_salary,

                    c.location AS location,

                    i.remarks,
                    i.created_at,
                    i.updated_at

                FROM interviews i

                LEFT JOIN companies c
                    ON i.company_id = c.company_id

                LEFT JOIN company_contacts cc
                    ON i.contact_id = cc.contact_id

                WHERE i.student_id = :student_id

                ORDER BY
                    i.interview_date DESC,
                    i.interview_id DESC
            """),
            {
                "student_id": student_id
            }
        )

        interviews = [
            dict(row)
            for row in interviews_result.mappings().all()
        ]

        # =================================================
        # EMPLOYMENT HISTORY
        # =================================================

        employment_result = connection.execute(
            text("""
                SELECT
                    eh.employment_id,
                    eh.student_id,
                    eh.company_id,
                    eh.company_name,
                    eh.role,
                    eh.employment_type,
                    eh.start_date,
                    eh.end_date,
                    eh.is_current,
                    eh.salary,
                    eh.location,
                    eh.remarks

                FROM employment_history eh

                WHERE eh.student_id = :student_id

                ORDER BY
                    eh.is_current DESC,
                    eh.start_date DESC,
                    eh.employment_id DESC
            """),
            {
                "student_id": student_id
            }
        )

        employment = [
            dict(row)
            for row in employment_result.mappings().all()
        ]

    return {
        "student": dict(student),

        "performance": (
            dict(performance)
            if performance
            else None
        ),

        "interviews": interviews,

        "employment": employment
    }