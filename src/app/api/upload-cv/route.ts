import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const pdfParseModule = await import('pdf-parse');
    // @ts-ignore
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';
    if (file.type === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      // For text files or others, just read as text
      text = new TextDecoder().decode(bytes);
    }

    if (!text) {
      return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert CV parser. Extract the following information from the provided CV text and return it strictly as a JSON object.
      
      The JSON structure must match this interface:
      interface WorkExperience {
        role: string;
        company: string;
        client: string;
        dates: string;
        bulletPoints: string[];
      }
      interface SkillCategory {
        name: string;
        items: string;
      }
      interface Education {
        degree: string;
        institution: string;
        location: string;
        details?: string;
      }
      interface Certification {
        name: string;
        date: string;
      }
      interface CVData {
        name: string;
        title: string;
        email: string;
        phone: string;
        location?: string;
        linkedin?: string;
        summary: string;
        skills: SkillCategory[];
        experience: WorkExperience[];
        education: Education[];
        certifications: Certification[];
        other: {
          label: string;
          value: string;
        };
      }

      CV Text:
      ${text}

      Return ONLY the JSON object. Do not include any markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsedText = response.text().trim();
    
    // Clean up potential markdown if Gemini included it despite instructions
    const jsonString = parsedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', parsedText);
      return NextResponse.json({ error: 'AI returned invalid JSON format', raw: parsedText }, { status: 500 });
    }

    // Get session to associate profile with user
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    // Save to database
    // @ts-ignore
    const userProfile = await prisma.userProfile.create({
      data: {
        name: name || parsedJson.name || 'Unknown',
        description: description,
        email: parsedJson.email,
        originalCvText: text,
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
