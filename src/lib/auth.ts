import { timingSafeEqual } from "crypto";
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
    // Single fixed account: LOGIN_EMAIL / LOGIN_PASSWORD from the environment
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.LOGIN_EMAIL;
        const password = process.env.LOGIN_PASSWORD;
        if (!email || !password || !credentials) return null;
        if (!safeEqual(credentials.email.trim().toLowerCase(), email.toLowerCase())) return null;
        if (!safeEqual(credentials.password, password)) return null;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: email.split("@")[0] },
        });
        return { id: user.id, name: user.name, email: user.email };
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

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
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
