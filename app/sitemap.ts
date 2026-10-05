import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/db';
import { STATIC_PAGES } from '@/lib/staticPages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cricmilan.in';

  const articles = await getPublishedArticles(100);

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0
    },
    {
      url: `${baseUrl}/category/cricket`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/category/breaking-news`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9
    },
    {
      url: `${baseUrl}/category/stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/category/india`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/category/world`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/category/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8
    }
  ];

  const infoPageEntries: MetadataRoute.Sitemap = Object.keys(STATIC_PAGES).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at),
    changeFrequency: 'daily',
    priority: article.is_breaking === 1 ? 0.9 : 0.8
  }));

  return [...staticEntries, ...infoPageEntries, ...articleEntries];
}
