import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://1331-movies-kh.netlify.app'),
  title: {
    default: '1331 Movies - Watch Free Movies & TV Shows Online in HD',
    template: '%s | 1331 Movies'
  },
  description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription or registration. New content added daily.',
  keywords: ['free movies', 'watch movies online', 'streaming', 'TV shows', 'HD movies', '1331 movies', 'free streaming', 'latest movies', 'watch series', 'no subscription'],
  authors: [{ name: '1331 Movies' }],
  creator: '1331 Movies',
  publisher: '1331 Movies',
  category: 'entertainment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://1331-movies-kh.netlify.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://1331-movies-kh.netlify.app',
    siteName: '1331 Movies',
    title: '1331 Movies - Watch Free Movies & TV Shows Online in HD',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription or registration. New content added daily.',
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
    title: 'MovieStream - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream your favorite content anytime, anywhere.',
    images: ['/og-image.jpg'],
    creator: '@moviestream',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  verification: {
    google: 'Z2rgllQdL-OEpI-J2M-iJ5wfovixGcWykhhX3BmK_6Y'
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
  other: {
    'google-site-verification': 'Z2rgllQdL-OEpI-J2M-iJ5wfovixGcWykhhX3BmK_6Y'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '1331 Movies',
    url: 'https://1331-movies-kh.netlify.app',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://1331-movies-kh.netlify.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '1331 Movies',
    url: 'https://1331-movies-kh.netlify.app',
    logo: 'https://1331-movies-kh.netlify.app/logo.png',
    sameAs: [
      'https://twitter.com/1331movies',
      'https://facebook.com/1331movies'
    ]
  };

  return (
    <html lang="en">
      <head>
        <script 
          id="aclib" 
          type="text/javascript" 
          src="//acscdn.com/script/aclib.js" 
          async
        />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body 
        className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
