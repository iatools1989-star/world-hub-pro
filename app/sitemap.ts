import { MetadataRoute } from 'next';
import { LOCALES, TOOLS, DIRECTORY_ITEMS } from '@/lib/data';
import { GUIDES } from '@/lib/guidesContent';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iatools.online';
  const entries: MetadataRoute.Sitemap = [];

  // Home por locale
  for (const loc of LOCALES) {
    entries.push({
      url: `${baseUrl}/${loc.code}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Ferramentas
    for (const tool of TOOLS) {
      entries.push({
        url: `${baseUrl}/${loc.code}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Páginas de confiança
    for (const path of ['about', 'contact', 'privacy', 'terms', 'affiliate-disclosure']) {
      entries.push({
        url: `${baseUrl}/${loc.code}/${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      });
    }

    // Índice do diretório (faltava: existia a página, não a entrada)
    entries.push({
      url: `${baseUrl}/${loc.code}/directory`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Diretório
    for (const item of DIRECTORY_ITEMS) {
      entries.push({
        url: `${baseUrl}/${loc.code}/directory/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
    // Guias e o índice deles
    entries.push({
      url: `${baseUrl}/${loc.code}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    for (const guide of Object.values(GUIDES)) {
      entries.push({
        url: `${baseUrl}/${loc.code}/guides/${guide.slug}`,
        lastModified: new Date(guide.updated),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Índice de ferramentas
    entries.push({
      url: `${baseUrl}/${loc.code}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return entries;
}
