import os
import smtplib
from email.message import EmailMessage


# =========================================================
# SEND EMAIL
# =========================================================

def send_interview_email(
    student_email: str,
    student_name: str,
    company_name: str,
    role: str,
    interview_date: str,
    interview_type: str,
    current_round: str,
    location: str | None = None
):

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # -----------------------------------------------------
    # CHECK EMAIL CONFIGURATION
    # -----------------------------------------------------

    if not smtp_host:
        raise Exception("SMTP_HOST is not configured")

    if not smtp_username:
        raise Exception("SMTP_USERNAME is not configured")

    if not smtp_password:
        raise Exception("SMTP_PASSWORD is not configured")

    # -----------------------------------------------------
    # CREATE EMAIL
    # -----------------------------------------------------

    message = EmailMessage()

    message["Subject"] = (
        "TTT NexGen Tracker - New Interview Scheduled"
    )

    message["From"] = smtp_username
    message["To"] = student_email

    location_text = location if location else "Not specified"

    message.set_content(
        f"""
Hello {student_name},

You have a new interview scheduled in TTT NexGen Tracker.

Interview Details
------------------------------

Company       : {company_name}
Role          : {role}
Date          : {interview_date}
Interview Type: {interview_type}
Round         : {current_round}
Location      : {location_text}

Please log in to TTT NexGen Tracker to view your complete interview details.

Best Regards,
TTT NexGen Tracker
Tweak Talent Technologies
"""
    )

    # -----------------------------------------------------
    # SEND EMAIL
    # -----------------------------------------------------

    with smtplib.SMTP(smtp_host, smtp_port) as server:

        server.starttls()

        server.login(
            smtp_username,
            smtp_password
        )

        server.send_message(message)

    return True