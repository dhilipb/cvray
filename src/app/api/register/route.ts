import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, parseBody, serverError } from "../profiles/_lib";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]{3,32}$/, "3-32 characters: letters, numbers, _ . -"),
  password: z.string().min(8, "At least 8 characters").max(128),
});

// shortcut: no rate limiting or captcha, add one if sign-ups get abused
export async function POST(req: NextRequest) {
  const parsed = await parseBody(req, registerSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  try {
    await prisma.user.create({
      data: {
        username: data.username,
        name: data.username,
        passwordHash: hashPassword(data.password),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return jsonError("Username already taken", 409);
    }
    return serverError("register", e);
  }
}
