import { MetadataRoute } from 'next'

export async function GET() {
  // Get your base URL from environment variable or set it directly
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.netlify.app'

  // Generate the XML content with video sitemap namespace
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      <url>
        <loc>${baseUrl}/anime</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <video:video>
          <video:thumbnail_loc>${baseUrl}/thumbnail.jpg</video:thumbnail_loc>
          <video:title>Anime Collection</video:title>
          <video:description>Browse our collection of anime videos</video:description>
          <video:content_loc>${baseUrl}/videos/sample.mp4</video:content_loc>
          <video:player_loc>${baseUrl}/anime</video:player_loc>
          <video:duration>120</video:duration>
          <video:publication_date>${new Date().toISOString()}</video:publication_date>
          <video:family_friendly>yes</video:family_friendly>
          <video:live>no</video:live>
        </video:video>
      </url>
    </urlset>`

  // Return the XML with proper content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
