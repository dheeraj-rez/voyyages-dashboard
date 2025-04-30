import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
      with: {
        tours: true,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, phone, status, rejectionReason } = body;

    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const updatedAgent = await db
      .update(agents)
      .set({
        name: name || agent.name,
        email: email || agent.email,
        phone: phone || agent.phone,
        status: status || agent.status,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, params.id))
      .returning();

    // Send appropriate email based on status change
    if (status === 'approved') {
      await sendEmail({
        to: agent.email,
        subject: 'Your AgentFlow Application Has Been Approved!',
        html: `
          <h1>Congratulations, ${agent.name}!</h1>
          <p>Your application to become an AgentFlow agent has been approved.</p>
          <p>You can now log in to your dashboard and start managing your tours.</p>
          <p>Best regards,<br>The AgentFlow Team</p>
        `,
      });
    } else if (status === 'rejected') {
      await sendEmail({
        to: agent.email,
        subject: 'Update on Your AgentFlow Application',
        html: `
          <h1>Dear ${agent.name},</h1>
          <p>We regret to inform you that your application to become an AgentFlow agent has not been approved at this time.</p>
          ${rejectionReason ? `<p>Reason: ${rejectionReason}</p>` : ''}
          <p>Thank you for your interest in AgentFlow.</p>
          <p>Best regards,<br>The AgentFlow Team</p>
        `,
      });
    }

    return NextResponse.json(updatedAgent[0]);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const deletedAgent = await db
      .delete(agents)
      .where(eq(agents.id, params.id))
      .returning();

    // Send deletion notification email
    await sendEmail({
      to: agent.email,
      subject: 'Your AgentFlow Account Has Been Deleted',
      html: `
        <h1>Dear ${agent.name},</h1>
        <p>This email is to confirm that your AgentFlow account has been deleted.</p>
        <p>If you believe this was done in error, please contact our support team.</p>
        <p>Best regards,<br>The AgentFlow Team</p>
      `,
    });

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
} 