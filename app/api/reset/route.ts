import { NextResponse } from 'next/server';
import prisma from '@/backend/lib/db';
import { consumeResetToken, markTokenUsed } from '@/backend/lib/reset';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const result = await consumeResetToken(token);
    if (!result.ok || !result.email) {
      return NextResponse.json({ error: result.reason || 'Invalid token.' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: result.email },
      data: { password },
    });

    await markTokenUsed(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
