import type { NextConfig } from 'next';

const DEFAULT_API_URL = 'https://api.dugodofficial.com';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

const resolveApiBaseUrl = () => {
  const candidate = process.env.NEXT_PUBLIC_API_URL;
  const isProd = process.env.NODE_ENV === 'production';

  if (!candidate) {
    return DEFAULT_API_URL;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch (error) {
    return DEFAULT_API_URL;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return DEFAULT_API_URL;
  }

  const isLocal = LOCAL_HOSTS.has(parsed.hostname);
  const appCandidate = process.env.NEXT_PUBLIC_APP_URL || (isProd ? 'https://admin.dugodofficial.com' : '');

  if (isProd && (isLocal || parsed.hostname === 'admin.dugodofficial.com')) {
    return DEFAULT_API_URL;
  }

  if (appCandidate) {
    try {
      const appHost = new URL(appCandidate).hostname;
      if (parsed.hostname === appHost) {
        return DEFAULT_API_URL;
      }
    } catch (error) {
      return DEFAULT_API_URL;
    }
  }

  if (isProd && parsed.protocol !== 'https:' && !isLocal) {
    return DEFAULT_API_URL;
  }

  return parsed.origin;
};

const apiUrl = resolveApiBaseUrl();
const apiHost = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || 'unknown',
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      // Helps mitigate XSS in some contexts; modern browsers mostly ignore this but it's safe.
      { key: 'X-XSS-Protection', value: '0' },
    ] as { key: string; value: string }[];

    if (isProd) {
      baseHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=15552000; includeSubDomains',
      });
    }

    return [
      {
        source: '/(.*)',
        headers: baseHeaders,
      },
    ];
  },
  async rewrites() {
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
        hostname: apiHost,
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
        hostname: 'dugodofficial-media.s3.eu-north-1.amazonaws.com',
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
        protocol: 'https',
        hostname: 'dugodofficial-public.s3.eu-north-1.amazonaws.com',
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
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
