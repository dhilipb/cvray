import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOwnedJob, getUserId, jsonError, serverError, unauthorized } from "../../../../_lib";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ profileId: string; jobId: string }> },
) {
  try {
    const { profileId, jobId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const source = await findOwnedJob(userId, profileId, jobId);
    if (!source) return jsonError("Job application not found", 404);

    const job = await prisma.jobApplication.create({
      data: {
        company: source.company,
        role: `${source.role} (copy)`.slice(0, 200),
        url: source.url,
        jobDescription: source.jobDescription,
        tweakedCvJson: source.tweakedCvJson,
        notes: source.notes,
        userProfileId: profileId,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return serverError("Duplicate Job Error:", error);
  }
}
