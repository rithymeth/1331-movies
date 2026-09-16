'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.includes('/watch/')) {
    return null;
  }

  return (
    <footer className="relative border-t border-white/10 bg-[#080b10] py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-3xl font-black">1331 Movies</h3>
          <p className="max-w-md text-slate-400">
            A TMDB-powered catalog for movies and TV shows. Save titles locally and jump back in from your library.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Explore</h4>
          <ul className="space-y-3 text-slate-300">
            <li><Link href="/trending" className="hover:text-white">Trending</Link></li>
            <li><Link href="/airing" className="hover:text-white">Airing</Link></li>
            <li><Link href="/movies" className="hover:text-white">Movies</Link></li>
            <li><Link href="/tv-shows" className="hover:text-white">TV Shows</Link></li>
            <li><Link href="/people" className="hover:text-white">People</Link></li>
            <li><Link href="/library" className="hover:text-white">Library</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Browse</h4>
          <ul className="space-y-3 text-slate-300">
            <li><Link href="/movies?country=KH" className="hover:text-white">Cambodia movies</Link></li>
            <li><Link href="/movies?language=km" className="hover:text-white">Khmer language</Link></li>
            <li><Link href="/tv-shows?country=KR" className="hover:text-white">Korean series</Link></li>
            <li><Link href="/search" className="hover:text-white">Search catalog</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {currentYear} 1331 Movies</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          <a href="https://github.com/rithymeth/1331-movies" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
