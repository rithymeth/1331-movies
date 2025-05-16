/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
  swcMinify: true,
  images: {
    domains: [
      'image.tmdb.org',
      's4.anilist.co',
      'media.kitsu.io',
      'img1.ak.crunchyroll.com',
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '1331-movies-kh.netlify.app',
            },
          ],
          destination: 'https://1331-movies-kh.com/:path*',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          },
          {
            key: 'Link',
            value: '<https://1331-movies-kh.com>; rel="canonical"'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
    ];
  },
}

module.exports = nextConfig
