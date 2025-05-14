import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://1331-movies.netlify.app'),
  title: {
    default: 'MovieStream - Watch Movies & TV Shows Online Free',
    template: '%s | MovieStream'
  },
  description: 'Watch the latest movies and TV shows online for free in HD quality. Stream your favorite content anytime, anywhere.',
  keywords: ['movies', 'tv shows', 'streaming', 'watch online', 'free movies', 'HD movies', 'latest movies', 'series'],
  authors: [{ name: 'MovieStream Team' }],
  creator: 'MovieStream',
  publisher: 'MovieStream',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://1331-movies.netlify.app',
    title: 'MovieStream - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream your favorite content anytime, anywhere.',
    siteName: 'MovieStream',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'MovieStream - Watch Movies & TV Shows Online',
    }],
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
    google: 'your-google-verification-code',
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
  category: 'entertainment',
  other: {
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script 
          id="aclib" 
          type="text/javascript" 
          src="//acscdn.com/script/aclib.js" 
          async
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
