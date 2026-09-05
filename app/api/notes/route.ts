import { NextResponse } from 'next/server';
import prisma from '@/backend/lib/db';
import { getUserEmail } from '@/backend/lib/session';

function getStreak(notes: { createdAt: bigint }[]): number {
  if (notes.length === 0) return 0;

  const dates = Array.from(
    new Set(
      notes.map((n) => new Date(Number(n.createdAt)).toISOString().split('T')[0])
    )
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

export async function GET() {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { authorEmail: email },
      orderBy: { createdAt: 'desc' },
    });

    const streak = getStreak(notes);

    const notesByDate: Record<string, typeof notes> = {};
    notes.forEach((note) => {
      const date = new Date(Number(note.createdAt)).toISOString().split('T')[0];
      if (!notesByDate[date]) {
        notesByDate[date] = [];
      }
      notesByDate[date].push(note);
    });

    return NextResponse.json({
      notes: notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: Number(note.createdAt),
      })),
      streak,
      notesByDate,
    });
  } catch (error) {
    console.error('Get notes API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        createdAt: BigInt(Date.now()),
        authorEmail: email,
      },
    });

    return NextResponse.json(
      {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: Number(note.createdAt),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create note API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.note.deleteMany({
      where: { authorEmail: email },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete all notes API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
