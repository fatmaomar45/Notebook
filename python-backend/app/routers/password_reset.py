from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.models import User, ResetToken
from app.schemas import PasswordResetRequest, PasswordReset
from app.services.mailer import send_reset_email
from app.services.reset import create_reset_token, consume_reset_token, mark_token_used
from app.services.session import set_session_cookie
from app.core.security import hash_password
from app.core.config import settings
from datetime import datetime


router = APIRouter()


@router.post("/forgot")
async def forgot_password(body: PasswordResetRequest, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user:
        return JSONResponse(content={"ok": True})

    record = await create_reset_token(db, user.email, settings.reset_token_ttl_minutes * 60 * 1000)
    origin = request.headers.get("origin", str(request.base_url))
    reset_url = f"{origin.rstrip('/')}/reset?token={record.token}"
    delivery = await send_reset_email(user.email, reset_url, settings.reset_token_ttl_minutes)
    return JSONResponse(
        content={"ok": True, "previewUrl": delivery.get("preview")}
    )


@router.post("/reset")
async def reset_password(body: PasswordReset, db: AsyncSession = Depends(get_db)):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    result = await consume_reset_token(db, body.token)
    if not result["ok"]:
        raise HTTPException(status_code=400, detail=result.get("reason", "Invalid token."))

    email = result["email"]
    record = result["record"]

    user_result = await db.execute(select(User).where(User.email == email))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token.")

    user.password = hash_password(body.password)
    await mark_token_used(db, record)
    await db.commit()
    return JSONResponse(content={"ok": True})
