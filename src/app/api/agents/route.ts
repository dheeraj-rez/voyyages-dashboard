import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

export async function GET() {
  try {
    const allAgents = await db.query.agents.findMany({
      with: {
        tours: true,
      },
      orderBy: (agents, { desc }) => [desc(agents.createdAt)],
    });
    return NextResponse.json(allAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if agent with email already exists
    const existingAgent = await db.query.agents.findFirst({
      where: eq(agents.email, email),
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: 'An agent with this email already exists' },
        { status: 400 }
      );
    }

    const newAgent = await db.insert(agents).values({
      name,
      email,
      phone,
      status: 'pending',
    }).returning();

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to AgentFlow',
      html: `
        <h1>Welcome to AgentFlow, ${name}!</h1>
        <p>Thank you for applying to become an agent. We will review your application and get back to you soon.</p>
        <p>Best regards,<br>The AgentFlow Team</p>
      `,
    });

    return NextResponse.json(newAgent[0], { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
} 