'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/app/context/AppContext';
import styles from './page.module.css';

export default function NoteForm({ editId }: { editId?: string } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('edit') || editId;
  const { notes, addNote, updateNote } = useApp();

  const editNote = useMemo(() => notes.find((n) => n.id === editParam) || null, [notes, editParam]);
  const [title, setTitle] = useState(() => editNote?.title ?? '');
  const [content, setContent] = useState(() => editNote?.content ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(editParam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing && editParam) {
        updateNote(editParam, { title: title.trim(), content: content.trim() });
      } else {
        addNote({ title: title.trim(), content: content.trim() });
      }
      router.push('/track');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (editParam && !editNote) {
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
