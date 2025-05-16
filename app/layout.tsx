import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'),
  title: '1331 Movies - Watch Movies & TV Shows Online Free',
  description: 'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
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
