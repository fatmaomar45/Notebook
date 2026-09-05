import { cookies } from 'next/headers';

const IS_LOGGED_IN = 'isLoggedIn';
const LAST_ACTIVITY = 'lastActivity';
const USER_EMAIL = 'userEmail';

export const IDLE_TIMEOUT_MS = 60 * 1000;
export const ABSOLUTE_TIMEOUT_MS = 60 * 60 * 1000;

export async function setLoggedInCookies(email: string) {
  const store = await cookies();
  const now = Date.now();
  store.set(IS_LOGGED_IN, 'true', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });
  store.set(LAST_ACTIVITY, String(now), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });
  store.set(USER_EMAIL, Buffer.from(email).toString('base64'), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });
}

export async function refreshActivity() {
  const store = await cookies();
  store.set(LAST_ACTIVITY, String(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });
}

export async function isSessionValid(): Promise<boolean> {
  const store = await cookies();
  const isLoggedIn = store.get(IS_LOGGED_IN)?.value === 'true';
  if (!isLoggedIn) return false;

  const lastActivity = Number(store.get(LAST_ACTIVITY)?.value || 0);
  const now = Date.now();

  if (!lastActivity || now - lastActivity > IDLE_TIMEOUT_MS) {
    return false;
  }
  return true;
}

export async function clearAllAuthCookies() {
  const store = await cookies();
  for (const name of [IS_LOGGED_IN, LAST_ACTIVITY, USER_EMAIL]) {
    store.set(name, '', { path: '/', maxAge: 0 });
  }
}

export async function getUserEmail(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(USER_EMAIL)?.value;
  if (!raw) return null;
  try {
    return Buffer.from(raw, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}
