import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "https://lumiar-production.up.railway.app",
  },
};

export default nextConfig;
