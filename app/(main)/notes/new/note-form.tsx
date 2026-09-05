'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Note } from '@/backend/lib/notes';
import styles from './page.module.css';

export default function NoteForm({ editId }: { editId?: string } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('edit') || editId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!editParam) return;

    cancelledRef.current = false;

    fetch(`/api/notes/${editParam}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load note');
        const note: Note = await res.json();
        if (!cancelledRef.current) {
          setTitle(note.title);
          setContent(note.content);
        }
      })
      .catch((err) => {
        if (!cancelledRef.current) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelledRef.current) {
          setLoadingNote(false);
        }
      });

    setLoadingNote(true);

    return () => {
      cancelledRef.current = true;
    };
  }, [editParam]);

  const isEditing = Boolean(editParam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing && editParam) {
        const res = await fetch(`/api/notes/${editParam}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        });
        if (!res.ok) throw new Error('Failed to update note');
      } else {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        });
        if (!res.ok) throw new Error('Failed to save note');
      }
      router.push('/track');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingNote) {
    return (
      <div className={`flex flex-col gap-5 max-w-lg mx-auto mt-8`}>
        <div className={`h-10 w-40 rounded-full bg-[#FCEEF1]`} />
        <div className={`h-14 w-full rounded-2xl bg-[#FCEEF1]`} />
        <div className={`h-48 w-full rounded-2xl bg-[#FCEEF1]`} />
        <div className={`h-14 w-40 rounded-full bg-[#FCEEF1] mx-auto`} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Note Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          rows={8}
          className={styles.textarea}
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Saving...' : isEditing ? 'Update Note' : 'Save Note'}
      </button>
    </form>
  );
}
