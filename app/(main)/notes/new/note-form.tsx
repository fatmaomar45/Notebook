'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveNote } from '@/lib/notes';
import styles from './page.module.css';

export default function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    saveNote({ title: title.trim(), content: content.trim() });
    router.push('/track');
  };

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

      <button type="submit" className={styles.submit}>
        Save Note
      </button>
    </form>
  );
}
