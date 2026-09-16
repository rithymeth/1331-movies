import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/app/lib/site';
import { fetchTmdbList, TmdbMediaListItem } from '@/app/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/trending',
    '/movies',
    '/tv-shows',
    '/people',
    '/search',
    '/library',
    '/privacy-policy'
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/trending' ? 'hourly' : 'daily',
    priority: path === '/' ? 1 : 0.8
  }));

  try {
    const [movies, shows, people] = await Promise.all([
      fetchTmdbList<TmdbMediaListItem>('/movie/popular'),
      fetchTmdbList<TmdbMediaListItem>('/tv/popular'),
      fetchTmdbList<{ id: number }>('/person/popular')
    ]);

    return [
      ...staticRoutes,
      ...movies.slice(0, 20).map((movie) => ({
        url: absoluteUrl(`/movie/${movie.id}`),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      })),
      ...shows.slice(0, 20).map((show) => ({
        url: absoluteUrl(`/tv-shows/${show.id}`),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      })),
      ...people.slice(0, 12).map((person) => ({
        url: absoluteUrl(`/person/${person.id}`),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
