import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorThemes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [theme] = await db
      .select()
      .from(colorThemes)
      .where(eq(colorThemes.id, parseInt(id)));

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Failed to fetch theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(colorThemes)
      .where(eq(colorThemes.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot modify built-in themes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, colors } = body;

    const [updated] = await db
      .update(colorThemes)
      .set({
        ...(name && { name }),
        ...(colors && { colors }),
        updatedAt: new Date(),
      })
      .where(eq(colorThemes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [existing] = await db
      .select()
      .from(colorThemes)
      .where(eq(colorThemes.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot delete built-in themes' },
        { status: 403 }
      );
    }

    await db.delete(colorThemes).where(eq(colorThemes.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete theme:', error);
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}
