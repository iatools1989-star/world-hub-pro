/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      // www -> apex: um endereco canonico so (evita conteudo duplicado)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.iatools.online' }],
        destination: 'https://iatools.online/:path*',
        permanent: true,
      },
      // /tools e /directory existem em /en/tools e /en/directory
      { source: '/tools', destination: '/en/tools', permanent: true },
      { source: '/tools/:path*', destination: '/en/tools/:path*', permanent: true },
      { source: '/directory', destination: '/en/directory', permanent: true },
      { source: '/directory/:path*', destination: '/en/directory/:path*', permanent: true },
      { source: '/about', destination: '/en/about', permanent: true },
      { source: '/privacy', destination: '/en/privacy', permanent: true },
      { source: '/terms', destination: '/en/terms', permanent: true },
      { source: '/contact', destination: '/en/contact', permanent: true },
      { source: '/affiliate-disclosure', destination: '/en/affiliate-disclosure', permanent: true },
    ];
  },
};

module.exports = nextConfig;
