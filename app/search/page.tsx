'use client';

import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import FilterButton from '../components/FilterButton';
import { useSearchParams, useRouter } from 'next/navigation';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  media_type: 'movie' | 'tv';
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'popularity.desc';

  const [results, setResults] = useState<SearchResult[]>([]);
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
        const combinedResults = responses.flatMap((response, index) =>
          response.results.map((item: SearchResult) => ({
            ...item,
            media_type: searchTypes[index] as 'movie' | 'tv'
          }))
        );

        // Sort combined results if needed
        const sortedResults = combinedResults.sort((a, b) => {
          if (sort === 'popularity.desc') return b.vote_count - a.vote_count;
          if (sort === 'rating.desc') return b.vote_average - a.vote_average;
          if (sort === 'date.desc') {
            const dateA = a.release_date || a.first_air_date || '';
            const dateB = b.release_date || b.first_air_date || '';
            return dateB.localeCompare(dateA);
          }
          return 0;
        });

        setResults(sortedResults);
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
    <main className="min-h-screen animated-bg">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-500/2 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl font-black gradient-text mb-4">
              {query ? `Search Results` : (type === 'all' ? 'Discover Content' : type === 'movie' ? 'Discover Movies' : 'Discover TV Shows')}
            </h1>
            {query && (
              <p className="text-xl text-gray-300 font-light">
                Results for "{query}"
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto space-y-6 glass p-6 rounded-2xl border border-white/10">
            {/* Type and Sort Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Content Type</label>
                <select
                  value={type}
                  onChange={(e) => updateSearchParams({ type: e.target.value })}
                  className="w-full glass-dark text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 border border-white/10"
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => updateSearchParams({ sort: e.target.value })}
                  className="w-full glass-dark text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 border border-white/10"
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="rating.desc">Highest Rated</option>
                  <option value="date.desc">Latest Release</option>
                </select>
              </div>
            </div>

            {/* Genre Filter Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Genres</label>
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
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">
                  {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>
              <div className="glass px-4 py-2 rounded-full">
                <span className="text-sm text-gray-300">
                  {type === 'all' ? 'Movies & TV Shows' : type === 'movie' ? 'Movies' : 'TV Shows'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {results.map((item, index) => (
                <div key={`${item.media_type}-${item.id}`} className="animate-scale-in" style={{animationDelay: `${index * 0.05}s`}}>
                  {item.media_type === 'movie' ? (
                    <MovieCard
                      id={item.id.toString()}
                      title={item.title || ''}
                      poster={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null}
                      year={item.release_date ? new Date(item.release_date).getFullYear().toString() : 'N/A'}
                      rating={item.vote_average}
                      voteCount={item.vote_count}
                      overview={item.overview}
                    />
                  ) : (
                    <TVShowCard
                      id={item.id.toString()}
                      name={item.name || ''}
                      poster={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null}
                      year={item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() : 'N/A'}
                      rating={item.vote_average}
                      voteCount={item.vote_count}
                      overview={item.overview}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center max-w-md">
              <svg
                className="w-20 h-20 text-gray-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-400 mb-4">
                No results found for "{query}"
              </p>
              <p className="text-sm text-gray-500">
                Try searching with different keywords or adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center max-w-md">
              <svg
                className="w-20 h-20 text-gray-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">
                Discover Amazing Content
              </h3>
              <p className="text-gray-400">
                Use the search bar above or browse by genre to find your next favorite movie or TV show
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
