import { MetadataRoute } from 'next';
import { LOCALES, TOOLS, DIRECTORY_ITEMS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.iatools.online';
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

    // Diretório
    for (const item of DIRECTORY_ITEMS) {
      entries.push({
        url: `${baseUrl}/${loc.code}/directory/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
