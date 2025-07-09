import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["utfs.io", "vcxi741wge.ufs.sh"],
  },
};

export default nextConfig;
