'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="pt-20 md:pl-64 min-h-screen">
        {children}
      </main>
    </>
  );
}
