import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorThemes } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const themes = await db
      .select()
      .from(colorThemes)
      .orderBy(desc(colorThemes.isBuiltIn), colorThemes.name);
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Failed to fetch themes:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, colors } = body;

    if (!name || !colors || !Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json(
        { error: 'Name and colors array are required' },
        { status: 400 }
      );
    }

    const [theme] = await db
      .insert(colorThemes)
      .values({
        name,
        colors,
        isBuiltIn: false,
      })
      .returning();

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    console.error('Failed to create theme:', error);
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
  }
}
