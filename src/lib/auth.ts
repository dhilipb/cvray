import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

/* --------- Auth Configuration --------- */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username.trim().toLowerCase() },
        });
        if (!user?.passwordHash || !verifyPassword(credentials.password, user.passwordHash)) {
          return null;
        }
        return { id: user.id, name: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  // debug logs tokens and secrets; never enable in production
  debug: process.env.NODE_ENV === "development",
};

/* --------- Passwords --------- */

// scrypt from node:crypto, stored as "salt:hash" (hex)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

/* --------- Temporary auth bypass --------- */

// Set AUTH_DISABLED=true in .env to skip login locally; ignored in production builds
export const AUTH_DISABLED =
  process.env.AUTH_DISABLED === "true" && process.env.NODE_ENV !== "production";

const GUEST_EMAIL = "guest@localhost";

export async function getAuthSession(): Promise<Session | null> {
  if (!AUTH_DISABLED) return getServerSession(authOptions);
  const user = await prisma.user.upsert({
    where: { email: GUEST_EMAIL },
    update: {},
    create: { email: GUEST_EMAIL, name: "Guest" },
  });
  return { user: { id: user.id, name: user.name, email: user.email }, expires: "" };
}
