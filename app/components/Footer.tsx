'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't show footer on video player pages
  if (pathname.includes('/watch/')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <h2 className="text-3xl font-bold text-white relative">
                <span className="text-blue-500">13</span>
                <span className="text-white">31</span>
                <span className="absolute -top-1 -right-2 text-xs text-blue-400">™</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left mb-2">
              Your Ultimate Movie & TV Experience
            </p>
            <p className="text-xs text-gray-500 text-center md:text-left">
              Stream. Watch. Enjoy.
            </p>
          </div>
          {/* Navigation */}
          <div className="md:col-span-1">

            <h3 className="text-white text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="hover:text-white transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">

            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies?genre=28" className="hover:text-white transition-colors">
                  Action Movies
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=35" className="hover:text-white transition-colors">
                  Comedy Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows?genre=18" className="hover:text-white transition-colors">
                  Drama Series
                </Link>
              </li>
              <li>
                <Link href="/tv-shows?genre=10759" className="hover:text-white transition-colors">
                  Action Series
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="md:col-span-1">

            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">
              1331 Movies is your premier destination for streaming movies and TV shows.
              Discover the latest releases and classic favorites, all in one place.
            </p>
            <div className="mt-4">
              <p className="text-sm">
                Powered by TMDB, we provide high-quality entertainment content with
                regular updates and new releases.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-sm">
            &copy; {currentYear} 1331 Movies. All rights reserved. Powered by 1331
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
