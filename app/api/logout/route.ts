import { NextResponse } from 'next/server';
import { clearAllAuthCookies } from '@/backend/lib/session';

export async function POST() {
  await clearAllAuthCookies();
  return NextResponse.json({ success: true });
}
