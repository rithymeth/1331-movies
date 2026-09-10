import type { Metadata } from 'next';
import { getBaseUrl, siteConfig } from '@/app/lib/site';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: `${siteConfig.name} - Watch Movies & TV Shows Online Free`,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Watch Movies & TV Shows Online Free`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Watch Movies & TV Shows Online Free`,
    description: 'Watch the latest movies and TV shows online for free in HD quality.',
    images: [siteConfig.ogImage]
  },
  other: {
    monetag: 'ea5b1f21a80c0f9747f48cfc61b114f4'
  }
};
