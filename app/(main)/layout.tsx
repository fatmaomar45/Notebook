import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Sidebar from '../components/sidebar';
import { IDLE_TIMEOUT_MS } from '@/backend/lib/session';
import IdleTimer from '../components/idle-timer';

function isExpired(timestamp: number, ttlMs: number) {
  return Date.now() - timestamp > ttlMs;
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('isLoggedIn')?.value === 'true';
  const lastActivity = Number(cookieStore.get('lastActivity')?.value || 0);

  if (!isLoggedIn) {
    redirect('/login?next=/');
  }

  const idleExpired = lastActivity > 0 && isExpired(lastActivity, IDLE_TIMEOUT_MS);
  if (!lastActivity || idleExpired) {
    redirect('/login?next=/&reason=timeout');
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64 p-8 min-h-screen bg-stone-50/50">
        {children}
      </main>
      <IdleTimer timeoutMs={IDLE_TIMEOUT_MS} />
    </div>
  );
}
