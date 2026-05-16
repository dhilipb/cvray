import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Verify ownership of the profile
    const profile = await prisma.userProfile.findFirst({
      where: {
        id: profileId,
        userId: userId,
      },
      include: {
        JobApplications: {
          orderBy: {
            appliedAt: 'desc',
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, jobs: profile.JobApplications, profileName: profile.name });
  } catch (error: any) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Verify ownership
    const profile = await prisma.userProfile.findFirst({
      where: { id: profileId, userId: userId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { company, role, jobDescription, url } = await req.json();

    const job = await prisma.jobApplication.create({
      data: {
        company,
        role,
        jobDescription,
        url,
        userProfileId: profileId,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    console.error('Create Job Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
