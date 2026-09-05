import secrets
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models import ResetToken


async def create_reset_token(db: AsyncSession, email: str, ttl_ms: int) -> ResetToken:
    now = datetime.utcnow()
    token = secrets.token_urlsafe(32)
    expires_at = datetime.fromtimestamp(now.timestamp() + ttl_ms / 1000)

    reset = ResetToken(
        token=token,
        email=email,
        created_at=int(now.timestamp() * 1000),
        expires_at=int(expires_at.timestamp() * 1000),
        used=False,
    )
    db.add(reset)

    await db.execute(
        delete(ResetToken).where(ResetToken.email == email, ResetToken.token != token)
    )
    await db.commit()
    await db.refresh(reset)
    return reset


async def consume_reset_token(db: AsyncSession, token: str):
    result = await db.execute(select(ResetToken).where(ResetToken.token == token))
    record = result.scalar_one_or_none()

    if not record:
        return {"ok": False, "reason": "Invalid or expired reset link."}

    if record.used:
        await db.delete(record)
        await db.commit()
        return {"ok": False, "reason": "This reset link has already been used."}

    now_ts = int(datetime.utcnow().timestamp() * 1000)
    if now_ts > record.expires_at:
        await db.delete(record)
        await db.commit()
        return {"ok": False, "reason": "This reset link has expired."}

    return {"ok": True, "email": record.email, "record": record}


async def mark_token_used(db: AsyncSession, record: ResetToken) -> None:
    record.used = True
    await db.commit()
