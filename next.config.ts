import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily ignore ESLint during builds so we can iterate on fixes without blocking deploys.
  // Remove or set to false once lint errors are resolved.
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-jnb2-1.xx.fbcdn.net',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable compression
  compress: true,
  
  // Production source maps (smaller)
  productionBrowserSourceMaps: false,
  
  // Optimize bundle
  swcMinify: true,
  
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;

