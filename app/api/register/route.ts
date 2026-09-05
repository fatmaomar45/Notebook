import { NextResponse } from 'next/server';
import prisma from '@/backend/lib/db';
import { setLoggedInCookies } from '@/backend/lib/session';

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

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 409 }
      );
    }

    await prisma.user.create({
      data: { email, password },
    });

    await setLoggedInCookies(email);

    return NextResponse.json(
      { success: true, message: 'Account created successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
