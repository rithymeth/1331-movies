import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/private/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.netlify.app'}/sitemap.xml`,
  };
}
