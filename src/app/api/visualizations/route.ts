import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { visualizations, projects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { defaultChartSettings, defaultData, defaultColumnMapping } from '@/lib/chart/config';

export async function GET() {
  try {
    const result = await db.select().from(visualizations).orderBy(desc(visualizations.updatedAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch visualizations:', error);
    return NextResponse.json({ error: 'Failed to fetch visualizations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name || 'Untitled visualization';

    // Create a project first
    const [project] = await db
      .insert(projects)
      .values({ name, folderId: body.folderId || null })
      .returning();

    // Create the visualization
    const [visualization] = await db
      .insert(visualizations)
      .values({
        projectId: project.id,
        name,
        chartType: body.chartType || 'bar_stacked',
        data: body.data || defaultData,
        settings: body.settings || defaultChartSettings,
        columnMapping: body.columnMapping || defaultColumnMapping,
      })
      .returning();

    return NextResponse.json(visualization, { status: 201 });
  } catch (error) {
    console.error('Failed to create visualization:', error);
    return NextResponse.json({ error: 'Failed to create visualization' }, { status: 500 });
  }
}
