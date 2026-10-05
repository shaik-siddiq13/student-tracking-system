from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from app.database import engine
from app.auth_dependencies import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =========================================================
# SCHEMAS
# =========================================================

class NotificationCreate(BaseModel):
    student_id: int
    title: str
    message: str
    notification_type: str = "GENERAL"


# =========================================================
# HELPER - GET STUDENT ID FROM LOGGED-IN USER
# =========================================================

def get_student_id_from_user(current_user):

    user_id = current_user.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID not found"
        )

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT student_id
                FROM students
                WHERE user_id = :user_id
            """),
            {
                "user_id": user_id
            }
        )

        row = result.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    return row.student_id


# =========================================================
# CREATE NOTIFICATION
# =========================================================

@router.post("/")
def create_notification(
    notification: NotificationCreate,
    current_user=Depends(get_current_user)
):

    try:

        with engine.begin() as conn:

            result = conn.execute(
                text("""
                    INSERT INTO notifications
                    (
                        student_id,
                        title,
                        message,
                        notification_type
                    )
                    VALUES
                    (
                        :student_id,
                        :title,
                        :message,
                        :notification_type
                    )
                    RETURNING notification_id
                """),
                {
                    "student_id": notification.student_id,
                    "title": notification.title,
                    "message": notification.message,
                    "notification_type": notification.notification_type
                }
            )

            notification_id = result.scalar()

        return {
            "message": "Notification created successfully",
            "notification_id": notification_id
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET STUDENT NOTIFICATIONS
# =========================================================

@router.get("/")
def get_notifications(
    current_user=Depends(get_current_user)
):

    try:

        # Get student_id using logged-in user_id
        student_id = get_student_id_from_user(current_user)

        with engine.connect() as conn:

            result = conn.execute(
                text("""
                    SELECT
                        notification_id,
                        title,
                        message,
                        notification_type,
                        is_read,
                        created_at
                    FROM notifications
                    WHERE student_id = :student_id
                    ORDER BY created_at DESC
                """),
                {
                    "student_id": student_id
                }
            )

            notifications = []

            for row in result:

                notifications.append({
                    "notification_id": row.notification_id,
                    "title": row.title,
                    "message": row.message,
                    "notification_type": row.notification_type,
                    "is_read": row.is_read,
                    "created_at": row.created_at
                })

        return notifications

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# MARK ONE NOTIFICATION AS READ
# =========================================================

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user=Depends(get_current_user)
):

    try:

        student_id = get_student_id_from_user(current_user)

        with engine.begin() as conn:

            result = conn.execute(
                text("""
                    UPDATE notifications
                    SET is_read = TRUE
                    WHERE notification_id = :notification_id
                    AND student_id = :student_id
                """),
                {
                    "notification_id": notification_id,
                    "student_id": student_id
                }
            )

            if result.rowcount == 0:

                raise HTTPException(
                    status_code=404,
                    detail="Notification not found"
                )

        return {
            "message": "Notification marked as read"
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@router.put("/read-all")
def mark_all_notifications_read(
    current_user=Depends(get_current_user)
):

    try:

        student_id = get_student_id_from_user(current_user)

        with engine.begin() as conn:

            conn.execute(
                text("""
                    UPDATE notifications
                    SET is_read = TRUE
                    WHERE student_id = :student_id
                """),
                {
                    "student_id": student_id
                }
            )

        return {
            "message": "All notifications marked as read"
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )