from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def get_env(name: str, default: str) -> str:
    return os.getenv(name, default).strip()


def get_env_list(name: str, default: list[str]) -> list[str]:
    raw_value = os.getenv(name)
    if not raw_value:
        return default

    values = [value.strip().rstrip("/") for value in raw_value.split(",")]
    return [value for value in values if value]


FRONTEND_ORIGIN = get_env("FRONTEND_ORIGIN", "http://localhost:3000").rstrip("/")
FRONTEND_BASE_URL = get_env("FRONTEND_BASE_URL", FRONTEND_ORIGIN).rstrip("/")
JWT_SECRET_KEY = get_env("JWT_SECRET_KEY", "change-me-in-production")
JWT_ALGORITHM = get_env("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_MINUTES = int(get_env("JWT_EXPIRES_MINUTES", "10080"))
GOOGLE_CLIENT_ID = get_env("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = get_env("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = get_env(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/auth/google/callback",
)
SMTP_HOST = get_env("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(get_env("SMTP_PORT", "587"))
SMTP_USER = get_env("SMTP_USER", "")
SMTP_APP_PASSWORD = "".join(get_env("SMTP_APP_PASSWORD", "").split())
MAIL_FROM = get_env("MAIL_FROM", SMTP_USER)
CORS_ORIGINS = get_env_list(
    "CORS_ORIGINS",
    [
        FRONTEND_ORIGIN,
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
)
raw_database_url = os.getenv("DATABASE_URL")
if raw_database_url and raw_database_url.strip():
    DATABASE_URL = raw_database_url.strip()
elif os.getenv("RENDER", "").strip().lower() == "true":
    # Render instances are ephemeral; default to a writable temp location when DATABASE_URL is not set.
    DATABASE_URL = "sqlite:////tmp/zoom_clone.db"
else:
    DATABASE_URL = f"sqlite:///{BASE_DIR / 'zoom_clone.db'}"
