import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'),
  title: '1331 Movies - Watch Movies & TV Shows Online Free',
  description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
  keywords: 'movies online, free movies, watch movies online, tv shows online, streaming movies, latest movies, HD movies',
  alternates: {
    canonical: '/',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com',
    siteName: '1331 Movies',
    title: '1331 Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '1331 Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1331 Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free in HD quality.',
    images: ['/og-image.jpg'],
  },
  other: {
    monetag: 'ea5b1f21a80c0f9747f48cfc61b114f4',
  },
  viewport: 'width=device-width, initial-scale=1.0',
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
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com',
    description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '1331 Movies',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}/logo.png`,
    sameAs: [
      'https://twitter.com/1331movies',
      'https://facebook.com/1331movies'
    ]
  };

  return (
    <html lang="en">
      <head>
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
        className={`${inter.className} animated-bg text-white min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <Navbar />
        <main className="relative z-10 flex-grow">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
