export const defaultMetadata = {
  title: '1331 Movies - Watch Movies & TV Shows Online Free',
  description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
  keywords: 'free movies, watch movies online, streaming, TV shows, HD movies, 1331 movies, free streaming',
  openGraph: {
    title: '1331 Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
    type: 'website',
    locale: 'en_US',
    url: 'https://1331-movies.com',
    siteName: '1331 Movies',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '1331 Movies - Watch Movies & TV Shows Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1331 Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://1331-movies.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
