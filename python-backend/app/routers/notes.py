from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate, NoteResponse
from app.services.session import get_email_from_cookie
from datetime import datetime
from typing import List


def get_user_email(request: Request) -> str | None:
    token = request.cookies.get("session")
    return get_email_from_cookie(token)


router = APIRouter()


@router.get("/", response_model=List[NoteResponse])
async def get_notes(request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(
        select(Note).where(Note.author_email == email).order_by(Note.created_at.desc())
    )
    notes = result.scalars().all()
    return [
        NoteResponse(id=note.id, title=note.title, content=note.content, createdAt=note.created_at)
        for note in notes
    ]


@router.post("/", response_model=NoteResponse, status_code=201)
async def create_note(note_in: NoteCreate, request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    note = Note(
        title=note_in.title.strip(),
        content=note_in.content.strip(),
        created_at=int(datetime.utcnow().timestamp() * 1000),
        author_email=email,
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return NoteResponse(id=note.id, title=note.title, content=note.content, createdAt=note.created_at)


@router.delete("/")
async def delete_all_notes(request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    await db.execute(delete(Note).where(Note.author_email == email))
    await db.commit()
    return {"ok": True}


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str, request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(select(Note).where(Note.id == note_id, Note.author_email == email))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")

    return NoteResponse(id=note.id, title=note.title, content=note.content, createdAt=note.created_at)


@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(note_id: str, note_in: NoteUpdate, request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(select(Note).where(Note.id == note_id, Note.author_email == email))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")

    if note_in.title is not None:
        note.title = note_in.title.strip() or note.title
    if note_in.content is not None:
        note.content = note_in.content.strip() or note.content

    await db.commit()
    await db.refresh(note)
    return NoteResponse(id=note.id, title=note.title, content=note.content, createdAt=note.created_at)


@router.delete("/{note_id}")
async def delete_note(note_id: str, request: Request, db: AsyncSession = Depends(get_db)):
    email = get_user_email(request)
    if not email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(select(Note).where(Note.id == note_id, Note.author_email == email))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")

    await db.delete(note)
    await db.commit()
    return {"ok": True}
