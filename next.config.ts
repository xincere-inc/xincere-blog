import { writeSwaggerSpecToFile } from '@/lib/generateSwagger';
import type { NextConfig } from 'next';

// Generate Swagger spec on Next.js startup
writeSwaggerSpecToFile();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'readdy.ai',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
};

export default nextConfig;
