'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../components/sidebar';
import IdleTimer from '../components/idle-timer';
import { useApp } from '@/app/context/AppContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login?next=' + encodeURIComponent(pathname));
    }
  }, [isLoggedIn, pathname, router]);

  if (!isLoggedIn) {
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
