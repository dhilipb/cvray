import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* --------- Shared helpers for /api/profiles routes --------- */

export async function getUserId(): Promise<string | null> {
  const session = await getAuthSession();
  return session?.user?.id ?? null;
}

export const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export const unauthorized = () => jsonError("Unauthorized", 401);

// Logs the real error server-side; never leaks internals to the client.
export function serverError(label: string, error: unknown) {
  console.error(label, error);
  return jsonError("Internal server error", 500);
}

export async function parseBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<{ data: z.infer<T> } | { error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: jsonError("Invalid JSON body", 400) };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`);
    return { error: jsonError(msg.join("; "), 400) };
  }
  return { data: result.data };
}

export const findOwnedProfile = (userId: string, profileId: string) =>
  prisma.userProfile.findFirst({ where: { id: profileId, userId } });

export const findOwnedJob = (userId: string, profileId: string, jobId: string) =>
  prisma.jobApplication.findFirst({
    where: { id: jobId, userProfileId: profileId, userProfile: { userId } },
  });

/* --------- Rate limiting --------- */

// shortcut: in-memory per-user limiter, resets on restart and is per-instance; move to Redis/DB if scaled horizontally
const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW_MS = 60 * 60 * 1000;
const aiLog = new Map<string, number[]>();

export function isAiRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (aiLog.get(userId) ?? []).filter((t) => now - t < AI_RATE_WINDOW_MS);
  const limited = recent.length >= AI_RATE_LIMIT;
  if (!limited) recent.push(now);
  aiLog.set(userId, recent);
  return limited;
}

export * from "./_schemas";
