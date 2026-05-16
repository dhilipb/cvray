import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, createUIMessageStreamResponse } from "ai";
import { z } from "zod";
import { cvSchema } from "@/lib/schemas/cv";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, jobId, profileId: _profileId, cvData, jobDescription } = await req.json();

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system: `You are an expert CV tailoring assistant. 
      Your goal is to help the user modify their CV and Cover Letter to better match a specific job description.
      
      Job Description:
      ${jobDescription}
      
      Current CV Data:
      ${JSON.stringify(cvData, null, 2)}
      
      When the user asks for changes (e.g., "Make it more formal", "Highlight my leadership skills", "Tailor the summary for this job"), use the provided tools to update the CV data or Cover Letter.
      
      Always provide a brief explanation of what you've changed after using a tool.
      If the user just asks a question, answer it normally.`,
      tools: {
        updateCV: tool({
          description: "Update the CV data with new information or modifications.",
          inputSchema: cvSchema,
          execute: async (newCvData) => {
            // Persist the change
            await prisma.jobApplication.update({
              where: { id: jobId },
              data: {
                tweakedCvJson: JSON.stringify(newCvData),
              },
            });
            return { success: true, updatedCv: newCvData };
          },
        }),
        updateCoverLetter: tool({
          description: "Update the cover letter text.",
          inputSchema: z.object({
            content: z.string().describe("The full text of the updated cover letter"),
          }),
          execute: async ({ content }) => {
            // Get current CV data to merge with cover letter
            const job = await prisma.jobApplication.findUnique({
              where: { id: jobId },
              select: { tweakedCvJson: true, userProfile: { select: { parsedProfileJson: true } } }
            });
            
            const currentCvData = JSON.parse(job?.tweakedCvJson || job?.userProfile.parsedProfileJson || "{}");
            currentCvData.coverLetter = content;

            await prisma.jobApplication.update({
              where: { id: jobId },
              data: {
                tweakedCvJson: JSON.stringify(currentCvData),
              },
            });
            return { success: true, updatedCoverLetter: content };
          },
        }),
      },
    });

    return createUIMessageStreamResponse({
      stream: result.toUIMessageStream()
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
