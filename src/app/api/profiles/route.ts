import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId, serverError, unauthorized } from "./_lib";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const profiles = await prisma.userProfile.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { JobApplications: true } } },
    });

    return NextResponse.json({ success: true, profiles });
  } catch (error: unknown) {
    return serverError("Fetch Profiles Error:", error);
  }
}
