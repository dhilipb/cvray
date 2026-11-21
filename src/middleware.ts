export { default } from "next-auth/middleware";

// Pages only: API route handlers check the session themselves and return JSON 401,
// whereas this middleware would redirect fetch() calls to an HTML page.
export const config = {
  matcher: ["/profiles/:path*", "/cv/:path*"],
};
