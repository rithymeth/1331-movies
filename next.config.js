/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'image.tmdb.org',
      's4.anilist.co',
      'media.kitsu.io',
      'img1.ak.crunchyroll.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Link',
            value: `<${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}/:path*>; rel="canonical"`,
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
