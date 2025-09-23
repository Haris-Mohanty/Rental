import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Set the workspace root to your current folder
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
