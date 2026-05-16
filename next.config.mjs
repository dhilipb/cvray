import { GeminiWebpackPlugin } from "./scripts/gemini-webpack-plugin.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-pdf/renderer"],
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins.push(new GeminiWebpackPlugin());
    }
    return config;
  },
};

export default nextConfig;
