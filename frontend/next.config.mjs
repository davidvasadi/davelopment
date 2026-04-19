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
};

export default nextConfig;