'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (path: string) => 
    `hover:text-blue-400 transition-colors ${
      pathname === path ? 'text-blue-400' : 'text-white'
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-dark shadow-2xl border-b border-white/10' : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-5">
          {/* Logo and Desktop Menu */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="1331 Movies"
                  width={44}
                  height={44}
                  className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                1331
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`relative px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm ${pathname === '/' ? 'text-primary-400 bg-primary-500/10' : 'text-white/80 hover:text-white'}`}>
                <span className="relative z-10 font-medium">Home</span>
                {pathname === '/' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg"></div>}
              </Link>
              <Link href="/movies" className={`relative px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm ${pathname === '/movies' ? 'text-primary-400 bg-primary-500/10' : 'text-white/80 hover:text-white'}`}>
                <span className="relative z-10 font-medium">Movies</span>
                {pathname === '/movies' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg"></div>}
              </Link>
              <Link href="/tv-shows" className={`relative px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm ${pathname === '/tv-shows' ? 'text-primary-400 bg-primary-500/10' : 'text-white/80 hover:text-white'}`}>
                <span className="relative z-10 font-medium">TV Shows</span>
                {pathname === '/tv-shows' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg"></div>}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows, genres..."
                  className="glass text-white text-sm px-5 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:bg-white/10 w-72 placeholder-white/60 transition-all duration-300 hover:bg-white/5"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-primary-400 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass p-3 rounded-xl text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 group"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="py-6 border-t border-white/20 space-y-6 glass-dark mx-4 rounded-b-2xl">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                href="/"
                className={`relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${pathname === '/' ? 'text-primary-400 bg-primary-500/10' : 'text-white/90 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium">Home</span>
                {pathname === '/' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-xl"></div>}
              </Link>
              <Link
                href="/movies"
                className={`relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${pathname === '/movies' ? 'text-primary-400 bg-primary-500/10' : 'text-white/90 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium">Movies</span>
                {pathname === '/movies' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-xl"></div>}
              </Link>
              <Link
                href="/tv-shows"
                className={`relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${pathname === '/tv-shows' ? 'text-primary-400 bg-primary-500/10' : 'text-white/90 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium">TV Shows</span>
                {pathname === '/tv-shows' && <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-xl"></div>}
              </Link>
            </div>
            
            {/* Mobile Search */}
            <div className="px-4">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows, genres..."
                  className="glass text-white text-sm px-5 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:bg-white/10 w-full placeholder-white/60 transition-all duration-300"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-primary-400 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </form>
            </div>


          </div>
        </div>
      </div>
    </nav>
  );
}
