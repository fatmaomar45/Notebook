import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Call Python FastAPI backend for authentication
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Invalid email or password.' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    // Set authentication cookie on Next.js side for additional client-side checks
    const store = await cookies();
    store.set('isLoggedIn', 'true', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });
    store.set('userEmail', Buffer.from(email).toString('base64'), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return NextResponse.json({
      success: true,
      user: userData,
    }, { status: 200 });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}