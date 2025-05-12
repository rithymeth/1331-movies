'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold flex items-center space-x-2 group">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">1331-Movie</span>
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800/80 transition-all duration-300"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>
        <div className="space-x-6">
          <Link
            href="/"
            className={`hover:text-blue-400 transition-colors duration-300 ${pathname === '/' ? 'text-blue-400' : 'text-gray-300'}`}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className={`hover:text-blue-400 transition-colors duration-300 ${pathname === '/movies' ? 'text-blue-400' : 'text-gray-300'}`}
          >
            Movies
          </Link>
          <Link
            href="/tv-shows"
            className={`hover:text-blue-400 transition-colors duration-300 ${pathname === '/tv-shows' ? 'text-blue-400' : 'text-gray-300'}`}
          >
            TV Shows
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
