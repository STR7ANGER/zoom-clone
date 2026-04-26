from __future__ import annotations

import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..auth import (
    create_access_token,
    find_user_by_email,
    get_current_user,
    hash_password,
    validate_email,
    verify_password,
)
from ..config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, FRONTEND_BASE_URL
from ..database import get_db
from ..models import User
from ..schemas import AuthResponse, LoginRequest, SignupRequest, UserOut
from ..services.auth import auth_payload

router = APIRouter()


@router.post("/auth/signup", response_model=AuthResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = validate_email(payload.email)
    if find_user_by_email(db, email):
        raise HTTPException(status_code=409, detail="An account already exists for this email")
    user = User(
        email=email,
        name=payload.name.strip(),
        password_hash=hash_password(payload.password),
        auth_provider="email",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return auth_payload(user)


@router.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = find_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return auth_payload(user)


@router.get("/auth/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.get("/auth/google/start")
def google_start(next: str = "/myhome") -> RedirectResponse:
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured")
    if not next.startswith("/"):
        next = "/myhome"
    state_payload = f"{secrets.token_urlsafe(16)}|{next}"
    query = urlencode(
        {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "select_account",
            "state": state_payload,
        }
    )
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@router.get("/auth/google/callback")
async def google_callback(
    code: str,
    state: str = "",
    db: Session = Depends(get_db),
) -> RedirectResponse:
    next_path = "/myhome"
    if "|" in state:
        next_path = state.split("|", 1)[1] or next_path
    if not next_path.startswith("/"):
        next_path = "/myhome"

    async with httpx.AsyncClient(timeout=15) as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_response.status_code >= 400:
            raise HTTPException(status_code=401, detail="Google sign in failed")
        access_token = token_response.json().get("access_token")
        profile_response = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if profile_response.status_code >= 400:
            raise HTTPException(status_code=401, detail="Unable to read Google profile")
        profile = profile_response.json()

    email = validate_email(profile.get("email", ""))
    user = find_user_by_email(db, email)
    if user:
        user.name = profile.get("name") or user.name
        user.avatar_url = profile.get("picture") or user.avatar_url
        user.google_sub = profile.get("sub") or user.google_sub
        if user.auth_provider == "email":
            user.auth_provider = "google"
    else:
        user = User(
            email=email,
            name=profile.get("name") or email.split("@", 1)[0],
            avatar_url=profile.get("picture"),
            google_sub=profile.get("sub"),
            auth_provider="google",
        )
        db.add(user)
    db.commit()
    db.refresh(user)

    frontend_query = urlencode({"token": create_access_token(user), "next": next_path})
    return RedirectResponse(f"{FRONTEND_BASE_URL}/auth/callback?{frontend_query}")
