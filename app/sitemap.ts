import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'

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

  const movieRoutes: MetadataRoute.Sitemap = await fetch(`${baseUrl}/api/discover/movie?page=1`).then(res => res.json()).then(data => data.results.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7
  }))) as MetadataRoute.Sitemap

  const tvRoutes: MetadataRoute.Sitemap = await fetch(`${baseUrl}/api/discover/tv?page=1`).then(res => res.json()).then(data => data.results.map((tv: any) => ({
    url: `${baseUrl}/tv-shows/${tv.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7
  }))) as MetadataRoute.Sitemap

  const animeRoutes: MetadataRoute.Sitemap = await fetch(`${baseUrl}/api/anime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          Page(page: 1, perPage: 50) {
            media(type: ANIME) {
              id
            }
          }
        }
      `,
    }),
  }).then(res => res.json()).then(data => data.data.Page.media.map((anime: any) => ({
    url: `${baseUrl}/anime/${anime.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7
  }))) as MetadataRoute.Sitemap

  return [...staticRoutes, ...movieRoutes, ...tvRoutes, ...animeRoutes]
}
