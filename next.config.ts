import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knex.com.bd',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    domains: ["images.unsplash.com"]
  },
};

export default nextConfig;
