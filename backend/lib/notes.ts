import prisma from '@/backend/lib/db';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

export async function getNotes(): Promise<Note[]> {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return notes.map((note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: Number(note.createdAt),
  }));
}

export async function getNoteById(id: string): Promise<Note | undefined> {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) return undefined;

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: Number(note.createdAt),
  };
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  const created = await prisma.note.create({
    data: {
      title: note.title,
      content: note.content,
      createdAt: BigInt(Date.now()),
      authorEmail: '', // Will be set by API route after auth
    },
  });

  return {
    id: created.id,
    title: created.title,
    content: created.content,
    createdAt: Number(created.createdAt),
  };
}

export async function updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | undefined> {
  const existing = await prisma.note.findUnique({
    where: { id },
  });

  if (!existing) return undefined;

  const updated = await prisma.note.update({
    where: { id },
    data: {
      title: updates.title ?? existing.title,
      content: updates.content ?? existing.content,
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    content: updated.content,
    createdAt: Number(updated.createdAt),
  };
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    await prisma.note.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getNotesByDate(): Promise<Map<string, Note[]>> {
  const notes = await getNotes();
  const map = new Map<string, Note[]>();

  notes.forEach((note) => {
    const date = new Date(note.createdAt).toISOString().split('T')[0];
    const existing = map.get(date) || [];
    existing.push(note);
    map.set(date, existing);
  });

  return map;
}

export async function getStreak(): Promise<number> {
  const notes = await getNotes();
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
