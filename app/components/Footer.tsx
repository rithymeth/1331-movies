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
          {/* Navigation */}
          <div>
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
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies?genre=28" className="hover:text-white transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=35" className="hover:text-white transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=18" className="hover:text-white transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=27" className="hover:text-white transition-colors">
                  Horror
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-white transition-colors">
                  DMCA Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">
              1331 Movies is your premier destination for streaming movies and TV shows.
              Powered by TMDB, we provide high-quality entertainment content.
            </p>
            {/* <div className="mt-4 flex space-x-4">
              <a
                href="https://github.com/rithymeth/1331-movies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div> */}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-sm">
            © {currentYear} 1331 Movies. All rights reserved. Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
