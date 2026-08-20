'use client';

import { getNotes, getNotesByDate, getStreak } from '@/lib/notes';
import styles from "./page.module.css";

function ActivityHeatmap() {
  const notesByDate = getNotesByDate();
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    const count = notesByDate.get(key)?.length || 0;
    days.push({ date: key, count, isToday: i === 0 });
  }

  return (
    <div className={styles.heatmap}>
      {days.map((day) => {
        let opacity = 'opacity-20';
        if (day.count > 0) opacity = 'opacity-70';
        if (day.count >= 3) opacity = 'opacity-100';
        return (
          <div
            key={day.date}
            className={`${styles.heatmapCell} ${opacity} ${day.isToday ? 'ring-2 ring-[var(--primary-strong)] ring-offset-2' : ''}`}
            title={`${day.date}: ${day.count} note${day.count !== 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}

export default function TrackPage() {
  const notes = getNotes();
  const streak = getStreak();
  const totalNotes = notes.length;

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Your Writing Journey
        </h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statEmoji}>🔥</div>
            <div className={styles.statValue}>{streak}</div>
            <div className={styles.statLabel}>Day Streak</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statEmoji}>📝</div>
            <div className={styles.statValue}>{totalNotes}</div>
            <div className={styles.statLabel}>Total Notes</div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardHeading}>
            Last 30 Days Activity
          </h2>
          <ActivityHeatmap />
          <div className={styles.heatmapLabels}>
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardHeading}>
            Recent Writings
          </h2>
          {notes.length === 0 ? (
            <p className={styles.emptyState}>
              No notes yet. Start writing your first note!
            </p>
          ) : (
            <ul className={styles.noteList}>
              {notes.slice(0, 10).map((note) => (
                <li
                  key={note.id}
                  className={styles.noteItem}
                >
                  <h3 className={styles.noteTitle}>
                    {note.title}
                  </h3>
                  <p className={styles.noteContent}>
                    {note.content}
                  </p>
                  <time className={styles.noteTime}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
