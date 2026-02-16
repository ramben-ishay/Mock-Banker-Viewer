import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  webpack: (config) => {
    // Allow importing .mjs files (needed for pdfjs-dist worker)
    config.resolve.alias.canvas = false;
    return config;
  },
  // Turbopack also needs the alias
  turbopack: {
    resolveAlias: {
      canvas: "",
    },
  },
};

export default nextConfig;
