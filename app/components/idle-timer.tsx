'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  timeoutMs: number;
}

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'visibilitychange'];

export default function IdleTimer({ timeoutMs }: Props) {
  const router = useRouter();
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    const ping = async () => {
      const now = Date.now();
      if (now - lastPingRef.current < 30_000) return;
      lastPingRef.current = now;
      try {
        const res = await fetch('/api/session/refresh', { method: 'POST' });
        if (res.status === 401) {
          router.replace('/login?next=/&reason=timeout');
        }
      } catch {
        // ignore
      }
    };

    const checkTimeout = () => {
      const last = Number(document.cookie
        .split('; ')
        .find((c) => c.startsWith('lastActivity='))
        ?.split('=')[1] || 0);
      if (!last) return;
      if (Date.now() - last > timeoutMs) {
        router.replace('/login?next=/&reason=timeout');
      }
    };

    const onActivity = () => {
      ping();
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
