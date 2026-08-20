export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

const STORAGE_KEY = 'notebook-notes';

export function getNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNote(note: Omit<Note, 'id' | 'createdAt'>): Note {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  notes.unshift(newNote);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  return newNote;
}

export function getNotesByDate(): Map<string, Note[]> {
  const notes = getNotes();
  const map = new Map<string, Note[]>();
  notes.forEach((note) => {
    const date = new Date(note.createdAt).toISOString().split('T')[0];
    const existing = map.get(date) || [];
    existing.push(note);
    map.set(date, existing);
  });
  return map;
}

export function getStreak(): number {
  const notes = getNotes();
  if (notes.length === 0) return 0;

  const dates = Array.from(new Set(notes.map((n) => new Date(n.createdAt).toISOString().split('T')[0]))).sort().reverse();
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
