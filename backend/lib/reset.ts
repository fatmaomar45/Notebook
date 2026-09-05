import prisma from '@/backend/lib/db';

export interface ResetRecord {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

export async function createResetToken(email: string, ttlMs: number): Promise<ResetRecord> {
  const now = Date.now();
  const token = crypto.randomUUID();
  
  await prisma.resetToken.create({
    data: {
      token,
      email,
      createdAt: now,
      expiresAt: now + ttlMs,
      used: false,
    },
  });

  await prisma.resetToken.deleteMany({
    where: { email, token: { not: token } },
  });

  return {
    token,
    email,
    createdAt: now,
    expiresAt: now + ttlMs,
    used: false,
  };
}

export async function consumeResetToken(token: string): Promise<{ ok: boolean; email?: string; reason?: string }> {
  const record = await prisma.resetToken.findUnique({
    where: { token },
  });

  if (!record) {
    return { ok: false, reason: 'Invalid or expired reset link.' };
  }

  if (record.used) {
    await prisma.resetToken.delete({ where: { token } });
    return { ok: false, reason: 'This reset link has already been used.' };
  }

  if (Date.now() > record.expiresAt) {
    await prisma.resetToken.delete({ where: { token } });
    return { ok: false, reason: 'This reset link has expired.' };
  }

  return { ok: true, email: record.email };
}

export async function markTokenUsed(token: string): Promise<void> {
  await prisma.resetToken.update({
    where: { token },
    data: { used: true },
  });
}
