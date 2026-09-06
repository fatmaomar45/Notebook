'use client';

import React, { createContext, useContext, useState } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

type AppContextType = {
  isLoggedIn: boolean;
  email: string | null;
  login: (email: string) => void;
  register: (email: string) => void;
  logout: () => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Note | undefined;
  deleteNote: (id: string) => boolean;
  clearNotes: () => void;
  streak: number;
  notesByDate: Map<string, Note[]>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const NOTES_KEY = 'notebook_notes';
const EMAIL_KEY = 'notebook_email';
const LOGGED_IN_KEY = 'notebook_logged_in';

function getNotesFromStorage(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getStreak(notes: Note[]): number {
  if (notes.length === 0) return 0;

  const dates = Array.from(
    new Set(notes.map((n) => new Date(n.createdAt).toISOString().split('T')[0]))
  ).sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diff = (current.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getInitialIsLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LOGGED_IN_KEY) === 'true';
}

function getInitialEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(EMAIL_KEY);
}

function getInitialNotes(): Note[] {
  return getNotesFromStorage();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialIsLoggedIn);
  const [email, setEmail] = useState<string | null>(getInitialEmail);
  const [notes, setNotes] = useState<Note[]>(getInitialNotes);

  const login = (userEmail: string) => {
    localStorage.setItem(LOGGED_IN_KEY, 'true');
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem('lastActivity', String(Date.now()));
    setIsLoggedIn(true);
    setEmail(userEmail);
  };

  const register = (userEmail: string) => {
    localStorage.setItem(LOGGED_IN_KEY, 'true');
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem('lastActivity', String(Date.now()));
    setIsLoggedIn(true);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setIsLoggedIn(false);
    setEmail(null);
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>): Note => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: note.title,
      content: note.content,
      createdAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotesToStorage(updated);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | undefined => {
    const updated = notes.map((n) => (n.id === id ? { ...n, ...updates } : n));
    setNotes(updated);
    saveNotesToStorage(updated);
    return updated.find((n) => n.id === id);
  };

  const deleteNote = (id: string): boolean => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotesToStorage(updated);
    return true;
  };

  const clearNotes = () => {
    setNotes([]);
    saveNotesToStorage([]);
  };

  const streak = getStreak(notes);
  const notesByDate = notes.reduce<Map<string, Note[]>>((map, note) => {
    const date = new Date(note.createdAt).toISOString().split('T')[0];
    const existing = map.get(date) || [];
    existing.push(note);
    map.set(date, existing);
    return map;
  }, new Map());

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        email,
        login,
        register,
        logout,
        notes,
        addNote,
        updateNote,
        deleteNote,
        clearNotes,
        streak,
        notesByDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
