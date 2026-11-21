import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  findOwnedJob,
  getUserId,
  jobUpdateSchema,
  jsonError,
  parseBody,
  serverError,
  unauthorized,
} from "../../../_lib";

type Params = { params: Promise<{ profileId: string; jobId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { profileId, jobId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    // Verify ownership of the profile and job
    const job = await prisma.jobApplication.findFirst({
      where: { id: jobId, userProfileId: profileId, userProfile: { userId } },
      include: { userProfile: true },
    });

    if (!job) return jsonError("Job application not found", 404);

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return serverError("Fetch Job Error:", error);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { profileId, jobId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    // Only whitelisted fields pass the schema, so userProfileId/id can't be reassigned.
    const parsed = await parseBody(req, jobUpdateSchema);
    if ("error" in parsed) return parsed.error;

    if (!(await findOwnedJob(userId, profileId, jobId))) {
      return jsonError("Job application not found", 404);
    }

    const job = await prisma.jobApplication.update({ where: { id: jobId }, data: parsed.data });

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return serverError("Update Job Error:", error);
  }
}

export { PUT as PATCH };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { profileId, jobId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    if (!(await findOwnedJob(userId, profileId, jobId))) {
      return jsonError("Job application not found", 404);
    }

    await prisma.jobApplication.delete({ where: { id: jobId } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return serverError("Delete Job Error:", error);
  }
}
