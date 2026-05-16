import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cvSchema } from "@/lib/schemas/cv";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // Get session to associate profile with user
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        fullText: "",
      };

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
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    // Use generateObject for structured extraction
    const { object: parsedJson } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: cvSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert CV parser. Analyze the provided CV document and extract all professional information accurately into the specified structure.

                     Please ensure:
                     1. The 'fullText' field contains the complete, unabridged text extracted from the document.
                     2. Experience is broken down into specific roles with detailed bullet points.
                     3. Skills are categorized appropriately.
                     4. All contact information (email, phone, location) is captured correctly.`,
            },
            {
              type: "file",
              data: buffer,
              mediaType: file.type,
            },
          ],
        },
      ],
    });

    // Save to database
    const userProfile = await prisma.userProfile.create({
      data: {
        name: name || parsedJson.name || "Unknown",
        description: description,
        email: parsedJson.email,
        originalCvText: parsedJson.fullText || "",
        parsedProfileJson: JSON.stringify(parsedJson),
        userId: userId,
      },
    });

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error: any) {
    console.error("CV Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
