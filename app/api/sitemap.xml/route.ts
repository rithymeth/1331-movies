import { NextResponse } from 'next/server';

async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com';
  const today = new Date().toISOString().split('T')[0];

  // Define your static routes
  const staticRoutes = [
    '',
    '/movies',
    '/tv-shows',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
    '/contact',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticRoutes
        .map(
          (route) => `
        <url>
          <loc>${baseUrl}${route}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
          <priority>${route === '' ? '1.0' : '0.8'}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`;

  return sitemap;
}

export async function GET() {
  const sitemap = await generateSitemap();

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
