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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch('/api/genres/movie').then((res) => res.json()),
          fetch('/api/genres/tv').then((res) => res.json())
        ]);
        const allGenres = [...movieGenres, ...tvGenres];
        setGenres(Array.from(new Map(allGenres.map((g: { id: number }) => [g.id, g])).values()));
      } catch (fetchError) {
        console.error('Error fetching genres:', fetchError);
      }
    };

    fetchGenres();
  }, []);

  const fetchPage = async (nextPage: number) => {
    const searchTypes = type === 'all' ? ['movie', 'tv'] : [type];
    const responses = await Promise.all(
      searchTypes.map((mediaType) => {
        const endpoint = query
          ? `/api/search/${mediaType}?query=${encodeURIComponent(query)}&genre=${genre}&sort=${sort}&page=${nextPage}`
          : `/api/discover/${mediaType}?genre=${genre}&sort=${sort}&page=${nextPage}`;
        return fetch(endpoint).then((res) => res.json());
      })
    );

    const combinedResults = responses.flatMap((response, index) => {
      const mediaType = searchTypes[index] as 'movie' | 'tv';
      return mapTmdbMediaCollection((response.results || []) as TmdbMediaListItem[], mediaType);
    });

    const nextTotalPages = Math.max(
      1,
      ...responses.map((response) => Number(response.total_pages || 1))
    );

    return {
      items: sortMediaCards(combinedResults, sort),
      totalPages: nextTotalPages
    };
  };

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError('');
      setPage(1);

      try {
        const data = await fetchPage(1);
        setResults(data.items);
        setTotalPages(data.totalPages);
      } catch (fetchError) {
        console.error('Error fetching content:', fetchError);
        setError('Failed to fetch content. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [query, type, genre, sort]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const data = await fetchPage(nextPage);
      setResults((current) => {
        const merged = [...current];
        data.items.forEach((item) => {
          if (!merged.some((entry) => entry.id === item.id && entry.mediaType === item.mediaType)) {
            merged.push(item);
          }
        });
        return merged;
      });
      setPage(nextPage);
      setTotalPages(data.totalPages);
    } catch (fetchError) {
      console.error('Error loading more results:', fetchError);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
      <div className="relative z-10 container mx-auto px-4 pb-20 pt-28">
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl mb-4">
              {query ? 'Search results' : type === 'all' ? 'Discover titles' : type === 'movie' ? 'Discover movies' : 'Discover TV shows'}
            </h1>
            {query ? <p className="text-sm text-slate-400">Results for &quot;{query}&quot;</p> : null}
          </div>

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
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Genres</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton label="All Genres" isActive={!genre} onClick={() => updateSearchParams({ genre: '' })} />
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Search failed" message={error} />
        ) : results.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </h2>
              <span className="text-xs font-medium text-slate-400">Page {page} of {totalPages}</span>
            </div>
            <MediaGrid items={results} emptyTitle="No matching titles yet" emptyMessage="Adjust the filters or try a broader search." />
            {page < totalPages ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white disabled:opacity-60"
                >
                  {isLoadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            ) : null}
          </div>
        ) : query ? (
          <EmptyState title="No results found" message={`No titles matched "${query}". Try different keywords or fewer filters.`} />
        ) : (
          <EmptyState
            title="Discover titles"
            message="Use the search bar above or browse by genre to find your next favorite movie or TV show."
            action={
              <Link href="/movies" className="inline-flex rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                Browse movies
              </Link>
            }
          />
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#080b10] pt-28 text-center text-slate-400">Loading search...</main>}>
      <SearchClient />
    </Suspense>
  );
}
