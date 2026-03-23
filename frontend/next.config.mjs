/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbopack: {
  //   root: process.cwd().replace('/next', ''),
  // },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',      port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'davelopment.hu',               pathname: '/uploads/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Csak a ténylegesen használt breakpointok — kisebb bundle
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    // Képek 1 hétig cachelve CDN-en
    minimumCacheTTL: 604800,
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/redirections`);
      const result = await res.json();
      return result.data.map(({ source, destination }) => ({
        source: `/:locale${source}`,
        destination: `/:locale${destination}`,
        permanent: false,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;