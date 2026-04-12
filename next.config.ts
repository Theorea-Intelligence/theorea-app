import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Théorea app configuration */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
