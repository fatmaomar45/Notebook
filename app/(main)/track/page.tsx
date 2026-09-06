'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useApp, Note } from '@/app/context/AppContext';
import styles from './page.module.css';

export default function TrackPage() {
  const { notes, streak, notesByDate, deleteNote, clearNotes } = useApp();

  const handleDelete = async (id: string) => {
    deleteNote(id);
  };

  const handleClearAll = async () => {
    clearNotes();
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.heading}>
            Your Writing Journey
          </h1>
          <p className={styles.subtitle}>
            Track your growth, one entry at a time
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

        <div className={styles.card}>
          <h2 className={styles.cardHeading}>
            Last 30 Days Activity
          </h2>
          <ActivityHeatmap notesByDate={notesByDate} />
          <div className={styles.heatmapLabels}>
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardHeading}>
              Recent Writings
            </h2>
            {notes.length > 0 && (
              <button
                onClick={handleClearAll}
                className={styles.clearAllBtn}
                type="button"
              >
                Clear All
              </button>
            )}
          </div>
          {notes.length === 0 ? (
            <p className={styles.emptyState}>
              No notes yet. Start writing your first note!
            </p>
          ) : (
            <ul className={styles.noteList}>
              {notes.map((note) => (
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
                  <div className={styles.noteActions}>
                    <Link
                      href={`/notes/new?edit=${note.id}`}
                      className={styles.noteActionBtn}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className={`${styles.noteActionBtn} ${styles.noteActionDelete}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

function ActivityHeatmap({ notesByDate }: { notesByDate: Map<string, Note[]> }) {
  const today = useMemo(() => new Date(), []);

  const days = useMemo(() => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const count = notesByDate.get(key)?.length || 0;
      result.push({ date: key, count, isToday: i === 0 });
    }
    return result;
  }, [notesByDate, today]);

  return (
    <div className={styles.heatmap}>
      {days.map((day) => {
        let intensityClass = styles.level0;
        if (day.count > 0 && day.count < 3) {
          intensityClass = styles.level1;
        } else if (day.count >= 3) {
          intensityClass = styles.level2;
        }

        const cellClasses = [
          styles.heatmapCell,
          intensityClass,
          day.isToday ? styles.cellToday : '',
        ].filter(Boolean).join(' ');

        return (
          <div
            key={day.date}
            className={cellClasses}
            title={`${day.date}: ${day.count} note${day.count !== 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}
