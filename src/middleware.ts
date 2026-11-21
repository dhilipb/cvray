import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// AUTH_DISABLED skips the login redirect locally (see getAuthSession in lib/auth.ts)
const authDisabled = process.env.AUTH_DISABLED === "true" && process.env.NODE_ENV !== "production";

export default authDisabled ? () => NextResponse.next() : withAuth({ pages: { signIn: "/" } });

// Pages only: API route handlers check the session themselves and return JSON 401,
// whereas this middleware would redirect fetch() calls to an HTML page.
export const config = {
  matcher: ["/profiles/:path*", "/cv/:path*"],
};
