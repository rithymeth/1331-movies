import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieStream - Watch Movies Online',
  description: 'Watch your favorite movies and TV shows online',
  other: {
    'google-adsense-account': 'ca-pub-1318099833166063',
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
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1318099833166063"
          crossOrigin="anonymous"
        />
      </head>
      <body 
        className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
