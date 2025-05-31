import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.metmuseum.org',
      },
      {
        hostname: 'placehold.co',
      },
    ],
  },
}

export default nextConfig
