import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    // Call Python FastAPI backend for logout
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // Logout request may fail, but we still clear local cookies
    });

    // Clear authentication cookies on Next.js side
    const store = await cookies();
    store.set('isLoggedIn', '', { path: '/', maxAge: 0 });
    store.set('userEmail', '', { path: '/', maxAge: 0 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Logout failed.' },
      { status: 500 }
    );
  }
}