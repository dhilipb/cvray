import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string, jobId: string }> }) {
  try {
    const { profileId, jobId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

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
  } catch (error: any) {
    console.error('Fetch Job Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
