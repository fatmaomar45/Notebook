from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Response
from app.core.config import settings


COOKIE_NAME = "session"
IDLE_TIMEOUT = timedelta(minutes=settings.idle_timeout_minutes)
ABSOLUTE_TIMEOUT = timedelta(hours=settings.absolute_timeout_hours)


def set_session_cookie(response: Response, email: str) -> None:
    payload = {
        "sub": email,
        "idle": datetime.utcnow().timestamp(),
        "exp": (datetime.utcnow() + ABSOLUTE_TIMEOUT).timestamp(),
    }
    token = jwt.encode(payload, settings.secret_key, algorithm="HS256")
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        path="/",
        max_age=int(ABSOLUTE_TIMEOUT.total_seconds()),
    )


def refresh_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        path="/",
        max_age=int(ABSOLUTE_TIMEOUT.total_seconds()),
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/")


def get_email_from_cookie(token: str | None) -> str | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        email = payload.get("sub")
        idle_ts = payload.get("idle")
        exp_ts = payload.get("exp")
        if not email or not idle_ts or not exp_ts:
            return None
        now = datetime.utcnow().timestamp()
        if now > exp_ts:
            return None
        if now - idle_ts > IDLE_TIMEOUT.total_seconds():
            return None
        return email
    except JWTError:
        return None


def is_session_valid(token: str | None) -> bool:
    return get_email_from_cookie(token) is not None
