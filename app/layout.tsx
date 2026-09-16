import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SiteChrome from './components/ui/SiteChrome';
import { defaultMetadata } from './metadata';
import { absoluteUrl, siteConfig } from '@/app/lib/site';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.png'),
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
      <body className="animated-bg text-white min-h-screen flex flex-col relative overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-cyan-300 focus:px-3 focus:py-2 focus:text-slate-950">
          Skip to content
        </a>
        <SiteChrome />
        <Navbar />
        <main id="main-content" className="relative z-10 flex-grow">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
