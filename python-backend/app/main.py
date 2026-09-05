from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, notes, password_reset, session as session_router


app = FastAPI(title="Notebook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(notes.router, prefix="/api/notes")
app.include_router(password_reset.router, prefix="/api")
app.include_router(session_router.router, prefix="/api/session")
