import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cvSchema } from '@/lib/schemas/cv';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    // Get session to associate profile with user
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    if (!file) {
      // Create empty profile if no file
      const emptyJson = {
        name: name || "New Profile",
        title: "",
        email: "",
        phone: "",
        summary: "",
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        fullText: ""
      };
      
      // @ts-ignore
      const userProfile = await prisma.userProfile.create({
        data: {
          name: emptyJson.name,
          description: description,
          email: null,
          originalCvText: "",
          parsedProfileJson: JSON.stringify(emptyJson),
          userId: userId,
        },
      });

      return NextResponse.json({ success: true, profile: userProfile });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configure Google provider directly to support PDF
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || '',
    });

    // Use generateObject for structured extraction
    const { object: parsedJson } = await generateObject({
      model: google('gemini-1.5-flash'), // Use gemini-1.5-flash which supports PDF
      schema: cvSchema,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `You are an expert CV parser. Extract all information from the provided CV. 
                     Also, extract the full text content accurately and put it in the "fullText" field.` 
            },
            {
              type: 'file',
              data: buffer,
              mimeType: file.type,
            },
          ],
        },
      ],
    });

    // Save to database
    // @ts-ignore
    const userProfile = await prisma.userProfile.create({
      data: {
        name: name || parsedJson.name || 'Unknown',
        description: description,
        email: parsedJson.email,
        originalCvText: parsedJson.fullText || '',
        parsedProfileJson: JSON.stringify(parsedJson),
        userId: userId,
      },
    });

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error: any) {
    console.error('CV Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
