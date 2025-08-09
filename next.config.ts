import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.metmuseum.org", "collectionapi.metmuseum.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "collectionapi.metmuseum.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
