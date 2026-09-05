from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, UserResponse
from app.core.security import verify_password, hash_password
from app.services.session import set_session_cookie

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserRegister, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="User already exists.")

    user = User(email=user_in.email, password=hash_password(user_in.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)

    set_session_cookie(response, user.email)
    return UserResponse(email=user.email)


@router.post("/login", response_model=UserResponse)
async def login(user_in: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(user_in.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    set_session_cookie(response, user.email)
    return UserResponse(email=user.email)


@router.post("/logout")
async def logout(response: Response):
    from app.services.session import clear_session_cookie
    clear_session_cookie(response)
    return JSONResponse(content={"success": True})
