import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
