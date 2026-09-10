import { MetadataRoute } from 'next'
import { absoluteUrl, getBaseUrl } from '@/app/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/tv-shows`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/anime`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.7
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]

  const fetchRoutes = async (url: string, init?: RequestInit): Promise<MetadataRoute.Sitemap> => {
    try {
      const response = await fetch(url, init);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.results)
        ? data.results.map((item: { id: number }) => ({
            url: absoluteUrl(`/movie/${item.id}`),
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7
          }))
        : [];
    } catch {
      return [];
    }
  };

  const movieRoutes = await fetchRoutes(`${baseUrl}/api/discover/movie?page=1`);
  const tvRoutes = (await fetchRoutes(`${baseUrl}/api/discover/tv?page=1`)).map((route) => ({
    ...route,
    url: route.url.replace('/movie/', '/tv-shows/')
  }));

  let animeRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${baseUrl}/api/anime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { Page(page: 1, perPage: 50) { media(type: ANIME) { id } } }`
      })
    });
    const data = await response.json();
    animeRoutes = (data.data?.Page?.media || []).map((anime: { id: number }) => ({
      url: absoluteUrl(`/anime/${anime.id}`),
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }));
  } catch {
    animeRoutes = [];
  }

  return [...staticRoutes, ...movieRoutes, ...tvRoutes, ...animeRoutes]
}
