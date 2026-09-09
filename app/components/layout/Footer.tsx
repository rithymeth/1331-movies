'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on video player pages
  if (pathname?.includes('/watch/')) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-b from-dark-900 via-dark-950 to-black text-white py-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-4xl font-black gradient-text">1331 Movies</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Your ultimate destination for discovering and watching the latest movies. 
                Explore our vast collection of films from all genres and eras.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://twitter.com/1331movies" target="_blank" rel="noreferrer" className="group p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://facebook.com/1331movies" target="_blank" rel="noreferrer" className="group p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-accent-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="mailto:contact@1331-movies-kh.com" className="group p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="https://github.com/rithymeth/1331-movies" target="_blank" rel="noreferrer" className="group p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/search" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-6">Categories</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/movies?genre=28" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Action Movies
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=35" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Comedy Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows?genre=18" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Drama Series
                </Link>
              </li>
              <li>
                <Link href="/tv-shows?genre=10759" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Action Series
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-gray-400 text-sm">
                © {currentYear} 1331 Movies. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Made with</span>
                <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>for movie lovers</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">Privacy Policy</Link>
              <a href="mailto:contact@1331-movies-kh.com" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">Contact</a>
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">About</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
