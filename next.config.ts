import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.dugodofficial.com';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL('http://127.0.0.1/assets/**'),
      {
        protocol: 'https',
        hostname:
          process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'dugodofficial.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'dugod-media.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'dugod-public.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/assets/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
