# Notebook Python Backend

A FastAPI backend for the Notebook app.

## Setup

```bash
cd python-backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment

Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. Also set `SECRET_KEY` to a random value.

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## API Docs

Once running, visit `http://localhost:8000/docs` for auto-generated API documentation.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/register | Create account |
| POST | /api/login | Login |
| POST | /api/logout | Logout |
| GET | /api/notes | List notes |
| POST | /api/notes | Create note |
| DELETE | /api/notes | Delete all notes |
| GET | /api/notes/{id} | Get note |
| PATCH | /api/notes/{id} | Update note |
| DELETE | /api/notes/{id} | Delete note |
| POST | /api/forgot | Request password reset |
| POST | /api/reset | Reset password |
| POST | /api/session/refresh | Refresh session |

## Notes

- Sessions are stored in httpOnly signed cookies.
- Passwords are hashed with bcrypt.
- Reset tokens are single-use and expire after 30 minutes.
