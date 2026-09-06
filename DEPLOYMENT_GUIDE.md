# DEPLOYMENT_GUIDE.md

## Architecture Overview

This application uses a **separate frontend and backend** architecture:

- **Frontend**: Next.js 16 (React) deployed on Vercel
- **Backend**: FastAPI (Python) with PostgreSQL database
- **Communication**: HTTP REST API with environment-based URL configuration

## Quick Start - Local Development

### 1. Backend Setup

```bash
cd python-backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and set DATABASE_URL and SECRET_KEY

# Run database migrations (if using Alembic)
# alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd ..  # Back to root

# Install dependencies
npm install

# Create .env.local
echo "PYTHON_BACKEND_URL=http://localhost:8000" > .env.local

# Start frontend
npm run dev
```

Frontend available at: `http://localhost:3000`

## Production Deployment

### 1. Python Backend Deployment

Choose your hosting platform:

#### Option A: Heroku

```bash
cd python-backend
heroku login
heroku create your-app-name
heroku config:set DATABASE_URL=postgresql://...
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
git push heroku main
```

#### Option B: Railway.app

```bash
cd python-backend
railway link
railway up
```

#### Option C: Render.com

1. Push code to GitHub
2. Connect repository to Render
3. Create new Web Service
4. Set Start Command: `uvicorn app.main:app --host 0.0.0.0`
5. Add environment variables

### 2. Update CORS Configuration

Before deploying, update `python-backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

# Get your actual frontend domain
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Next.js Frontend Deployment to Vercel

```bash
# Make sure .env.local is in .gitignore
echo ".env.local" >> .gitignore

git add .
git commit -m "Fix: Connect frontend to Python backend"
git push origin main
```

Then in Vercel dashboard:
1. Import repository
2. Set Environment Variables:
   - `PYTHON_BACKEND_URL`: Your backend URL (e.g., `https://your-app.herokuapp.com`)
3. Deploy

## Environment Variables Reference

### Frontend (.env.local or Vercel)
- `PYTHON_BACKEND_URL`: Base URL for Python backend API

### Backend (.env file)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret (min 32 chars, use `secrets.token_urlsafe(32)`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Email configuration (optional)
- `IDLE_TIMEOUT_MINUTES`: Session idle timeout
- `ABSOLUTE_TIMEOUT_HOURS`: Max session duration
- `RESET_TOKEN_TTL_MINUTES`: Password reset token expiration

## Testing the Integration

1. Open frontend: `https://notebook-ruddy-one.vercel.app`
2. Navigate to login page
3. Use browser DevTools Network tab to verify:
   - Login request is sent to Python backend
   - Response is 200 with user data
   - Cookies are set on the browser
4. Check Python backend logs for any errors

## Troubleshooting

### Login fails with "Internal server error"

Check Python backend logs:
```bash
heroku logs --tail
# or
railway logs
# or check Render dashboard
```

Common issues:
- `DATABASE_URL` not set
- `SECRET_KEY` not set
- CORS misconfigured
- Backend service not running

### "Cannot POST /api/login" or 404 errors

Verify:
- `PYTHON_BACKEND_URL` is set correctly in Vercel
- Backend is running and accessible
- No typos in endpoint paths

### Session not persisting

Ensure:
- Cookies are being set (check DevTools Application tab)
- Backend and frontend use compatible cookie settings
- Session endpoints work: `GET /api/session/refresh`

## API Endpoints

All endpoints are on the Python backend:

- `POST /api/register` - Create account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `POST /api/forgot` - Request password reset
- `POST /api/reset` - Reset password
- `POST /api/session/refresh` - Refresh session
- `GET /api/notes` - List user's notes
- `POST /api/notes` - Create note
- `GET /api/notes/{id}` - Get note details
- `PATCH /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

See `python-backend/README.md` for detailed API documentation.

