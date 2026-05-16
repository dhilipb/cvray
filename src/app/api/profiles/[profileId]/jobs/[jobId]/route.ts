import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string, jobId: string }> }) {
  try {
    const { profileId, jobId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verify ownership of the profile and job
    const job = await prisma.jobApplication.findFirst({
      where: {
        id: jobId,
        userProfileId: profileId,
        userProfile: {
          userId: userId
        }
      },
      include: {
        userProfile: true
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    console.error('Fetch Job Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ profileId: string, jobId: string }> }) {
  try {
    const { profileId, jobId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { role, company, jobDescription } = body;

    // Verify ownership
    const existingJob = await prisma.jobApplication.findFirst({
      where: {
        id: jobId,
        userProfileId: profileId,
        userProfile: { userId }
      }
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job application not found or unauthorized' }, { status: 404 });
    }

    const updatedJob = await prisma.jobApplication.update({
      where: { id: jobId },
      data: {
        role: role !== undefined ? role : existingJob.role,
        company: company !== undefined ? company : existingJob.company,
        jobDescription: jobDescription !== undefined ? jobDescription : existingJob.jobDescription,
      }
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: unknown) {
    console.error('Update Job Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
