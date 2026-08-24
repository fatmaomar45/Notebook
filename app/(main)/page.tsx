'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      router.replace('/track');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
