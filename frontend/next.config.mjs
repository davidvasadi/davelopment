/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  serverExternalPackages: ['sharp'],
  // turbopack: {
  //   root: process.cwd().replace('/next', ''),
  // },
  images: {
    // Dev: optimizer kikapcsolva — Next.js nem fetch-el localhost-ról (private IP blokk)
    // Prod: optimizer bekapcsolva, a képek davelopment.hu-ról jönnek
    unoptimized: isDev,
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '1337', pathname: '/**' },
      { protocol: 'https', hostname: 'davelopment.hu',          pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 604800,
  },
  pageExtensions: ['ts', 'tsx'],

  // Map localized URL segments to internal Next.js routes
  async rewrites() {
    return [
      // hu: projektek → products
      { source: '/hu/projektek',        destination: '/hu/products' },
      { source: '/hu/projektek/:slug*', destination: '/hu/products/:slug*' },
      // hu: szolgaltatasok → services
      { source: '/hu/szolgaltatasok',        destination: '/hu/services' },
      { source: '/hu/szolgaltatasok/:slug*', destination: '/hu/services/:slug*' },
    ]
  },

  // Security headers — applied to every response.
  // CSP is tuned to allow Google Analytics / Ads (Consent Mode) and CMS images,
  // while blocking clickjacking, MIME-sniffing and protocol downgrade.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com https://*.google.com https://*.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.googleadservices.com https://*.doubleclick.net https://davelopment.hu",
      "frame-src 'self' https://*.doubleclick.net https://*.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;