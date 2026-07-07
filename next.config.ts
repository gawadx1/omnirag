import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "tesseract.js", "mammoth", "chromadb"],
  webpack: (config) => {
    config.externals = [...(config.externals || []), "canvas", "sharp"];
    return config;
  },
};

export default nextConfig;
