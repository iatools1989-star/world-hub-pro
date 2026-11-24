/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * pdf.js e pdf-lib sao usados no navegador (PDF to JPG, Compress PDF,
   * Merge PDF, JPG to PDF, Resume Builder) e vem do proprio bundle — antes
   * eram baixados de cdnjs em tempo de execucao, o que quebrava a promessa
   * de processamento sem chamadas externas.
   *
   * O build legado do pdf.js faz `require('canvas')` num trecho que so roda
   * em Node (renderizacao no servidor). No navegador esse trecho nunca e
   * executado, mas o webpack tenta resolver o modulo e falha. O alias abaixo
   * resolve para `false`, que e o jeito padrao de dizer "isso nao existe no
   * cliente".
   */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
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
