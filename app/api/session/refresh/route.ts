import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { IDLE_TIMEOUT_MS } from '@/backend/lib/session';

export async function POST() {
  const store = await cookies();
  const isLoggedIn = store.get('isLoggedIn')?.value === 'true';
  if (!isLoggedIn) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  store.set('lastActivity', String(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(IDLE_TIMEOUT_MS / 1000),
  });

  return NextResponse.json({ authenticated: true });
}
