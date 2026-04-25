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
CORS_ORIGINS = get_env_list(
    "CORS_ORIGINS",
    [
        FRONTEND_ORIGIN,
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
)
DATABASE_URL = get_env("DATABASE_URL", f"sqlite:///{BASE_DIR / 'zoom_clone.db'}")
