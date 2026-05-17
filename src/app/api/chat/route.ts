import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cvSchema } from "@/lib/schemas/cv";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  tool,
  stepCountIs,
} from "ai";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, jobId, profileId: _profileId, cvData, jobDescription } = await req.json();

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      system: `You are an expert CV tailoring assistant. 
      Your goal is to help the user modify their CV and Cover Letter to better match a specific job description.
      
      Job Description:
      ${jobDescription}
      
      Current CV Data:
      ${JSON.stringify(cvData, null, 2)}
      
      When the user asks for changes (e.g., "Make it more formal", "Highlight my leadership skills", "Tailor the summary for this job"), use the provided tools to update the CV data or Cover Letter.
      
      *IMPORTANT INSTRUCTIONS*:
      - Explicit page breaks are controlled by the "break" boolean property on items in the "experience" array. Set it to true to add a break, or false/undefined to remove it.
      - If the user asks to remove a page break, check if any experience item has "break": true. If none do, the page break is happening AUTOMATICALLY because the PDF page ran out of space. DO NOT just say "there are no page breaks". Instead, explain that the break is automatic due to content length, and offer to shorten the text (like the summary or bullet points) or add an explicit break earlier to improve the layout.
      - Always provide a brief explanation of what you've changed after using a tool.
      - If the user just asks a question, answer it normally.`,
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
              select: {
                tweakedCvJson: true,
                userProfile: { select: { parsedProfileJson: true } },
              },
            });

            const currentCvData = JSON.parse(
              job?.tweakedCvJson || job?.userProfile.parsedProfileJson || "{}",
            );
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
      stream: result.toUIMessageStream(),
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
