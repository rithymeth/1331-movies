'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Suggestion {
  id: number;
  title: string;
  posterPath: string | null;
  type: 'movie' | 'tv';
  year: string;
}

export default function CommandSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-command-search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-command-search', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const timeout = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(timeout);
    }
    setQuery('');
    setSuggestions([]);
  }, [open]);

  useEffect(() => {
    const value = query.trim();
    if (!open || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          fetch(`/api/search/movie?query=${encodeURIComponent(value)}`, { signal: controller.signal }),
          fetch(`/api/search/tv?query=${encodeURIComponent(value)}`, { signal: controller.signal })
        ]);
        const [movies, tv] = await Promise.all([moviesResponse.json(), tvResponse.json()]);
        const movieResults = (movies.results || []).slice(0, 5).map((item: { id: number; title: string; poster_path: string | null; release_date?: string }) => ({
          id: item.id,
          title: item.title,
          posterPath: item.poster_path,
          type: 'movie' as const,
          year: item.release_date?.slice(0, 4) || ''
        }));
        const tvResults = (tv.results || []).slice(0, 5).map((item: { id: number; name: string; poster_path: string | null; first_air_date?: string }) => ({
          id: item.id,
          title: item.name,
          posterPath: item.poster_path,
          type: 'tv' as const,
          year: item.first_air_date?.slice(0, 4) || ''
        }));
        setSuggestions([...movieResults, ...tvResults].slice(0, 8));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [open, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d131c] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!query.trim()) return;
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setOpen(false);
          }}
          className="border-b border-white/10"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies and TV shows"
            className="w-full bg-transparent px-5 py-4 text-base text-white outline-none placeholder:text-slate-500"
          />
        </form>
        <div className="max-h-[50vh] overflow-y-auto">
          {isSearching ? <p className="px-5 py-4 text-sm text-slate-500">Searching...</p> : null}
          {!isSearching && query.trim().length >= 2 && suggestions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-slate-500">No matching titles.</p>
          ) : null}
          {suggestions.map((suggestion) => (
            <Link
              key={`${suggestion.type}-${suggestion.id}`}
              href={suggestion.type === 'movie' ? `/movie/${suggestion.id}` : `/tv-shows/${suggestion.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
            >
              <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded bg-[#121923]">
                {suggestion.posterPath ? (
                  <Image src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`} alt="" fill sizes="32px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{suggestion.title}</p>
                <p className="text-xs text-slate-500">
                  {suggestion.type === 'movie' ? 'Movie' : 'TV show'}{suggestion.year ? ` · ${suggestion.year}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[11px] text-slate-500">
          <span>Enter to search all results</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
