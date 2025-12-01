/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd().replace('/next', ''),
  },
  images: {
    remotePatterns: [
      // DEV – Strapi lokálisan (FIGYELEM: pathname)
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      // PROD – Strapi ugyanazon a domainen, képek az /uploads alatt
      { protocol: 'https', hostname: 'davelopment.hu', pathname: '/uploads/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    let redirections = [];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/redirections`);
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => ({
        source: `/:locale${source}`,
        destination: `/:locale${destination}`,
        permanent: false,
      }));
      redirections = redirections.concat(redirectItems);
      return redirections;
    } catch (error) {
      return [];
    }
  },
};

export default nextConfig;
