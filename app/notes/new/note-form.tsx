'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.push('/track');
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-transparent">
    
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">
        Create a New Note
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
       
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Note Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
           
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            required
          />
        </div>

       
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            rows={6}
          
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
            required
          />
        </div>

       
        <button
          type="submit"
          className="w-full py-3.5 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all mt-2"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}
