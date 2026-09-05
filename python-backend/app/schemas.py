from pydantic import BaseModel
from datetime import datetime
from typing import List


class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    email: str


class NoteBase(BaseModel):
    title: str
    content: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class NoteResponse(NoteBase):
    id: str
    createdAt: int

    model_config = {"from_attributes": True}


class PasswordResetRequest(BaseModel):
    email: str


class PasswordReset(BaseModel):
    token: str
    password: str


class ResetTokenResponse(BaseModel):
    token: str
    email: str
    createdAt: int
    expiresAt: int
    used: bool


class NotesByDate(BaseModel):
    date: str
    notes: List[NoteResponse]
