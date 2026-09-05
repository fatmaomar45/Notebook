import { NextResponse } from 'next/server';
import prisma from '@/backend/lib/db';
import { getUserEmail } from '@/backend/lib/session';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const note = await prisma.note.findFirst({
      where: { id, authorEmail: email },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    return NextResponse.json({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: Number(note.createdAt),
    });
  } catch (error) {
    console.error('Get note API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, content } = await request.json();

    const existing = await prisma.note.findFirst({
      where: { id, authorEmail: email },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: title?.trim() ?? existing.title,
        content: content?.trim() ?? existing.content,
      },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: Number(updated.createdAt),
    });
  } catch (error) {
    console.error('Update note API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.note.findFirst({
      where: { id, authorEmail: email },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete note API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
