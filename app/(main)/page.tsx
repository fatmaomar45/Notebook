'use client';

import Link from 'next/link';
import { useApp } from '@/app/context/AppContext';
import styles from './page.module.css';

export default function HomePage() {
  const { email, streak, notes } = useApp();

  return (
    <main className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.title}>Becoming Her</h1>
        <p className={styles.subtitle}>
          Welcome back, {email || 'friend'}
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statEmoji}>🔥</div>
          <div className={styles.statValue}>{streak}</div>
          <div className={styles.statLabel}>Day Streak</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statEmoji}>📝</div>
          <div className={styles.statValue}>{notes.length}</div>
          <div className={styles.statLabel}>Total Notes</div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <Link href="/notes/new" className={styles.primaryBtn}>
          Write New Note
        </Link>
        <Link href="/track" className={styles.secondaryBtn}>
          View Progress
        </Link>
      </div>
    </main>
  );
}
