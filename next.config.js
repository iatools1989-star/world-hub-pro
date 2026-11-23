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
    ];
  },
};

module.exports = nextConfig;
