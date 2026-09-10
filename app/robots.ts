import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/app/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/private/*'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
