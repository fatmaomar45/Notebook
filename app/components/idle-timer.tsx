'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  timeoutMs: number;
}

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'visibilitychange'];

export default function IdleTimer({ timeoutMs }: Props) {
  const router = useRouter();

  useEffect(() => {
    const checkTimeout = () => {
      const last = Number(localStorage.getItem('lastActivity') || 0);
      if (!last) return;
      if (Date.now() - last > timeoutMs) {
        router.replace('/login?next=/&reason=timeout');
      }
    };

    const onActivity = () => {
      localStorage.setItem('lastActivity', String(Date.now()));
      checkTimeout();
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const interval = window.setInterval(checkTimeout, 5_000);

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(interval);
    };
  }, [router, timeoutMs]);

  return null;
}
