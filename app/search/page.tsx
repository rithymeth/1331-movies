'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import FilterButton from '../components/ui/FilterButton';
import EmptyState from '../components/ui/EmptyState';
import MediaGrid from '../components/movie/MediaGrid';
import { useSearchParams, useRouter } from 'next/navigation';
import { mapTmdbMediaCollection, sortMediaCards, MediaCardItem } from '@/app/lib/media';
import { MediaSort, TmdbMediaListItem } from '@/app/lib/tmdb';

function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const genre = searchParams.get('genre') || '';
  const sort = (searchParams.get('sort') as MediaSort | null) || 'popularity.desc';

  const [results, setResults] = useState<MediaCardItem[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch('/api/genres/movie').then(res => res.json()),
          fetch('/api/genres/tv').then(res => res.json())
        ]);
        
        // Combine and deduplicate genres
        const allGenres = [...movieGenres, ...tvGenres];
        const uniqueGenres = Array.from(new Map(allGenres.map(g => [g.id, g])).values());
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError('');

      try {
        const searchTypes = type === 'all' ? ['movie', 'tv'] : [type];
        const searchPromises = searchTypes.map(mediaType => {
          const endpoint = query 
            ? `/api/search/${mediaType}?query=${encodeURIComponent(query)}&genre=${genre}&sort=${sort}`
            : `/api/discover/${mediaType}?genre=${genre}&sort=${sort}`;
          return fetch(endpoint).then(res => res.json());
        });

        const responses = await Promise.all(searchPromises);
        const combinedResults = responses.flatMap((response, index) => {
          const mediaType = searchTypes[index] as 'movie' | 'tv';
          return mapTmdbMediaCollection((response.results || []) as TmdbMediaListItem[], mediaType);
        });

        setResults(sortMediaCards(combinedResults, sort));
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to fetch content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [query, type, genre, sort]);

  const updateSearchParams = (params: { [key: string]: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/search?${newParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#080b10]">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-500/2 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-20 pt-28">
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl mb-4">
              {query ? `Search Results` : (type === 'all' ? 'Discover Content' : type === 'movie' ? 'Discover Movies' : 'Discover TV Shows')}
            </h1>
            {query && (
              <p className="text-sm text-slate-400">
                Results for "{query}"
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto space-y-6 rounded-2xl border border-white/10 bg-[#11161d] p-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const input = event.currentTarget.elements.namedItem('search') as HTMLInputElement;
                updateSearchParams({ q: input.value.trim() });
              }}
              className="flex gap-2"
            >
              <input
                name="search"
                defaultValue={query}
                placeholder="Search titles..."
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
              <button type="submit" className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white">
                Search
              </button>
            </form>
            {/* Type and Sort Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Content type</label>
                <select
                  value={type}
                  onChange={(e) => updateSearchParams({ type: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => updateSearchParams({ sort: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="rating.desc">Highest Rated</option>
                  <option value="date.desc">Latest Release</option>
                </select>
              </div>
            </div>

            {/* Genre Filter Buttons */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Genres</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All Genres"
                  isActive={!genre}
                  onClick={() => updateSearchParams({ genre: '' })}
                />
                {genres.map((g) => (
                  <FilterButton
                    key={g.id}
                    label={g.name}
                    isActive={genre === g.id.toString()}
                    onClick={() => updateSearchParams({ genre: g.id.toString() })}
                  />
                ))}
              </div>
            </div>
          </div>


        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
            </div>
            <p className="text-gray-300 font-medium">Searching for amazing content...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="glass-dark p-6 rounded-2xl border border-red-500/20">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-center font-semibold">{error}</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-xs font-medium text-slate-400">
                  {type === 'all' ? 'Movies & TV Shows' : type === 'movie' ? 'Movies' : 'TV Shows'}
                </span>
              </div>
            </div>

            <MediaGrid items={results} emptyTitle="No matching titles yet" emptyMessage="Adjust the filters or try a broader search." />
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <EmptyState
              title="No results found"
              message={`No titles matched "${query}". Try different keywords or fewer filters.`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <EmptyState
              title="Discover amazing content"
              message="Use the search bar above or browse by genre to find your next favorite movie or TV show."
              action={
                <Link href="/movies" className="inline-flex rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                  Browse movies
                </Link>
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen animated-bg flex items-center justify-center">
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading search...</p>
        </div>
      </main>
    }>
      <SearchClient />
    </Suspense>
  );
}
