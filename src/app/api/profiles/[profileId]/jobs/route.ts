import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

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
  } catch (error: unknown) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verify ownership
    const profile = await prisma.userProfile.findFirst({
      where: { id: profileId, userId: userId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { company, role, jobDescription, url } = await req.json();

    let tweakedCvJson = undefined;

    if (jobDescription && profile.parsedProfileJson) {
      try {
        const cvData = JSON.parse(profile.parsedProfileJson);
        const google = createGoogleGenerativeAI({
          apiKey: process.env.GEMINI_API_KEY || "",
        });

        const prompt = `You are an expert career coach and cover letter writer.
Based on the following Job Description and the User's CV, generate a highly tailored, professional cover letter.
The cover letter should be comprehensive, highlighting the user's most relevant experiences and skills that align with the job requirements.

Important formatting rules:
- Do NOT include the header (name, contact info, date) as that is already rendered by the PDF template. 
- Start directly with a professional greeting like "Dear Hiring Team," or "Dear Hiring Manager,".
- End with a professional sign-off and the user's name.
- Bold key terms, skills, and metrics in the cover letter (e.g., **9 years of experience**, **product delivery**, **Selenium automation**) to make them stand out, just like in modern cover letters. Use markdown **bolding** for this.
- Keep it to 4-5 well-crafted paragraphs.
- Ensure the tone is confident, professional, and directly addresses the needs mentioned in the job description.

Job Description:
${jobDescription}

User CV:
${JSON.stringify(cvData, null, 2)}`;

        const { text: coverLetter } = await generateText({
          model: google("gemini-2.5-flash"),
          prompt,
        });

        cvData.coverLetter = coverLetter;
        tweakedCvJson = JSON.stringify(cvData);
      } catch (aiError) {
        console.error("AI Cover Letter Generation Error:", aiError);
      }
    }

    const job = await prisma.jobApplication.create({
      data: {
        company,
        role,
        jobDescription,
        url,
        userProfileId: profileId,
        tweakedCvJson,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    console.error('Create Job Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
