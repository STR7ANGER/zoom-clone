from fastapi import HTTPException

from ..auth import normalize_email


def valid_invitees(invitees: list[str]) -> list[str]:
    normalized: list[str] = []
    for invitee in invitees:
        email = normalize_email(invitee)
        if not email:
            continue
        if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
            raise HTTPException(status_code=422, detail=f"Invalid invite email: {invitee}")
        if email not in normalized:
            normalized.append(email)
    return normalized
