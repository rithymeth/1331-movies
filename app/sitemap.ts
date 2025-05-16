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

  return staticRoutes
}
