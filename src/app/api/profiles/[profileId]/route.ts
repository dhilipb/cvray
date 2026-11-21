import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  findOwnedProfile,
  getUserId,
  jsonError,
  parseBody,
  profileUpdateSchema,
  serverError,
  unauthorized,
} from "../_lib";

type Params = { params: Promise<{ profileId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const profile = await findOwnedProfile(userId, profileId);
    if (!profile) return jsonError("Profile not found", 404);

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    return serverError("Fetch Profile Error:", error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const parsed = await parseBody(req, profileUpdateSchema);
    if ("error" in parsed) return parsed.error;
    const { name, description, parsedProfileJson } = parsed.data;

    const json = parsedProfileJson ? JSON.stringify(parsedProfileJson) : undefined;
    if (json && json.length > 2_000_000) return jsonError("Profile data too large", 413);

    if (!(await findOwnedProfile(userId, profileId))) return jsonError("Profile not found", 404);

    const profile = await prisma.userProfile.update({
      where: { id: profileId },
      data: { name, description, parsedProfileJson: json },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    return serverError("Update Profile Error:", error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const userId = await getUserId();
    if (!userId) return unauthorized();

    if (!(await findOwnedProfile(userId, profileId))) return jsonError("Profile not found", 404);

    // Explicit child delete: don't rely on DB-level FK cascade being enabled.
    await prisma.$transaction([
      prisma.jobApplication.deleteMany({ where: { userProfileId: profileId } }),
      prisma.userProfile.delete({ where: { id: profileId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return serverError("Delete Profile Error:", error);
  }
}
