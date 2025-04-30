import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tours } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allTours = await db.query.tours.findMany({
      with: {
        agent: true,
      },
    });
    return NextResponse.json(allTours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, agentId, status = 'pending' } = await request.json();

    const newTour = await db.insert(tours).values({
      name,
      description,
      price,
      agentId,
      status,
    }).returning();

    return NextResponse.json(newTour[0], { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
} 