from __future__ import annotations

import smtplib
from email.message import EmailMessage

from .config import MAIL_FROM, SMTP_APP_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_USER


def send_meeting_invite(
    *,
    to_email: str,
    title: str,
    starts_at: str,
    duration_minutes: int,
    invite_link: str,
    host_name: str,
) -> None:
    subject = f"Invitation: {title}"
    body = (
        f"You are invited to a Zoom meeting.\n\n"
        f"Topic: {title}\n"
        f"When: {starts_at}\n"
        f"Duration: {duration_minutes} minutes\n"
        f"Host: {host_name}\n\n"
        f"Join meeting:\n{invite_link}\n"
    )

    if not SMTP_USER or not SMTP_APP_PASSWORD or not MAIL_FROM:
        print(f"[invite-email:fallback] To: {to_email}\nSubject: {subject}\n{body}")
        return

    message = EmailMessage()
    message["From"] = MAIL_FROM
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_APP_PASSWORD)
            smtp.send_message(message)
    except smtplib.SMTPException as exc:
        print(f"[invite-email:failed] To: {to_email} Subject: {subject} Error: {exc}")
