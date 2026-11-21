import { GeminiWebpackPlugin } from "./scripts/gemini-webpack-plugin.mjs";

const isDev = process.env.NODE_ENV === "development";

// 'unsafe-inline' scripts: Next.js inline bootstrap without nonces; styles: MUI/emotion.
// blob:/fonts.gstatic.com: @react-pdf renders into a blob: iframe and fetches fonts client-side.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://fonts.gstatic.com${isDev ? " ws:" : ""}`,
  "frame-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@react-pdf/renderer"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins.push(new GeminiWebpackPlugin());
    }
    return config;
  },
};

export default nextConfig;
