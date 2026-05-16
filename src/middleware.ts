export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profiles/:path*", "/cv/:path*", "/api/upload-cv/:path*"],
};
