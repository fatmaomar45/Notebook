import { NextResponse } from 'next/server';
import prisma from '@/backend/lib/db';
import { createResetToken } from '@/backend/lib/reset';
import { sendResetEmail } from '@/backend/lib/mailer';

const RESET_TTL_MINUTES = 30;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const record = await createResetToken(email, RESET_TTL_MINUTES * 60 * 1000);
    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/reset?token=${record.token}`;
    const delivery = await sendResetEmail({ to: email, resetUrl, ttlMinutes: RESET_TTL_MINUTES });

    return NextResponse.json({
      ok: true,
      previewUrl: delivery.delivered ? undefined : resetUrl,
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
