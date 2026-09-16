'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/trending', label: 'Trending' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv-shows', label: 'TV' },
  { href: '/people', label: 'People' },
  { href: '/library', label: 'Library' }
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: number; title: string; posterPath: string | null; type: 'movie' | 'tv'; year: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, { signal: controller.signal }),
          fetch(`/api/search/tv?query=${encodeURIComponent(query)}`, { signal: controller.signal })
        ]);
        const [movies, tv] = await Promise.all([moviesResponse.json(), tvResponse.json()]);
        const movieResults = (movies.results || []).slice(0, 4).map((item: { id: number; title: string; poster_path: string | null; release_date?: string }) => ({
          id: item.id, title: item.title, posterPath: item.poster_path, type: 'movie' as const, year: item.release_date?.slice(0, 4) || ''
        }));
        const tvResults = (tv.results || []).slice(0, 4).map((item: { id: number; name: string; poster_path: string | null; first_air_date?: string }) => ({
          id: item.id, title: item.name, posterPath: item.poster_path, type: 'tv' as const, year: item.first_air_date?.slice(0, 4) || ''
        }));
        setSuggestions([...movieResults, ...tvResults].slice(0, 6));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const closeSuggestions = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setSuggestions([]);
    };
    document.addEventListener('mousedown', closeSuggestions);
    return () => document.removeEventListener('mousedown', closeSuggestions);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (href: string) =>
    `relative px-3 py-2 text-sm rounded-lg transition-all duration-300 hover:bg-white/10 ${
      pathname === href ? 'text-white bg-white/10 border border-white/10' : 'text-white/80 hover:text-white'
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#080b10]/95 shadow-2xl border-b border-white/10 backdrop-blur-xl' : 'bg-gradient-to-b from-[#080b10]/90 to-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image src="/logo.png" alt="1331 Movies" width={48} height={48} className="rounded-xl transition-all duration-300 group-hover:scale-105" />
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-300">1331</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  <span className="relative z-10 font-semibold">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={() => window.dispatchEvent(new Event('open-command-search'))} className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10" aria-label="Open search palette">
              Search
              <kbd className="rounded border border-white/15 bg-black/40 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group" ref={searchRef}>
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search titles..." className="input-modern w-64 pl-12 pr-4 py-3 text-white placeholder-white/60" />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {(isSearching || suggestions.length > 0) && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0d131c] shadow-2xl">
                    {isSearching ? <p className="px-4 py-4 text-sm text-gray-400">Searching...</p> : suggestions.map((suggestion) => (
                      <Link key={`${suggestion.type}-${suggestion.id}`} href={suggestion.type === 'movie' ? `/movie/${suggestion.id}` : `/tv-shows/${suggestion.id}`} onClick={() => { setSuggestions([]); setSearchQuery(''); }} className="flex items-center gap-3 border-b border-white/5 px-3 py-2.5 last:border-0 hover:bg-white/10">
                        <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded bg-[#121923]">
                          {suggestion.posterPath && (
                            <Image src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`} alt="" fill sizes="32px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{suggestion.title}</p>
                          <p className="text-xs text-gray-500">{suggestion.type === 'movie' ? 'Movie' : 'TV Show'}{suggestion.year ? ` · ${suggestion.year}` : ''}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </form>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden glass p-3 rounded-xl text-white/90" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-6 border-t border-white/20 space-y-4 glass-dark mx-4 rounded-2xl mb-4 px-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`${linkClass(link.href)} block`} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleSearch}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search titles..." className="input-modern w-full px-4 py-3 text-white" />
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
