from sqlalchemy import Column, String, BigInteger, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class User(Base):
    __tablename__ = "user"

    email = Column(String, primary_key=True, index=True)
    password = Column(String, nullable=False)
    notes = relationship("Note", back_populates="author", cascade="all, delete-orphan")
    reset_tokens = relationship("ResetToken", back_populates="user", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "note"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(BigInteger, nullable=False)
    author_email = Column(String, ForeignKey("user.email"), nullable=False)
    author = relationship("User", back_populates="notes")


class ResetToken(Base):
    __tablename__ = "reset_token"

    token = Column(String, primary_key=True, index=True)
    email = Column(String, ForeignKey("user.email"), nullable=False)
    created_at = Column(BigInteger, nullable=False)
    expires_at = Column(BigInteger, nullable=False)
    used = Column(Boolean, default=False)
    user = relationship("User", back_populates="reset_tokens")
