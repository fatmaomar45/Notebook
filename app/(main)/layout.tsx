'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '../components/sidebar';
import IdleTimer from '../components/idle-timer';
import { useApp } from '@/app/context/AppContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const authed = isLoggedIn || status === 'authenticated';

  useEffect(() => {
    if (status === 'loading') return;
    if (!authed) {
      router.replace('/login?next=' + encodeURIComponent(pathname));
    }
  }, [authed, status, pathname, router]);

  if (!authed) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:pl-64 p-8 min-h-screen bg-stone-50/50">
        {children}
      </main>
      <IdleTimer timeoutMs={15 * 60 * 1000} />
    </div>
  );
}
