from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt
from datetime import datetime
from app.core.database import get_db
from app.core.config import settings
from app.services.session import is_session_valid, get_email_from_cookie, refresh_session_cookie


router = APIRouter()


@router.post("/refresh")
async def refresh_session(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("session")
    email = get_email_from_cookie(token)
    if not email:
        return JSONResponse(content={"authenticated": False}, status_code=401)

    new_token = create_updated_token(token)
    refresh_session_cookie(response, new_token)
    return JSONResponse(content={"authenticated": True})


def create_updated_token(old_token: str) -> str:
    try:
        payload = jwt.decode(old_token, settings.secret_key, algorithms=["HS256"])
    except Exception:
        return old_token

    payload["idle"] = datetime.utcnow().timestamp()
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")
