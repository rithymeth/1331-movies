'use client';

import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import FilterButton from '../components/FilterButton';
import GoogleAdsense from '../components/GoogleAdsense';
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
        const searchPromises = searchTypes.map(mediaType =>
          fetch(`/api/discover/${mediaType}?genre=${genre}&sort=${sort}`)
            .then(res => res.json())
        );

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
  }, [type, genre, sort]);

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
    <div className="pt-24 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            {type === 'all' ? 'All Content' : type === 'movie' ? 'Movies' : 'TV Shows'}
          </h1>

          {/* Filters */}
          <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
            {/* Type and Sort Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={type}
                onChange={(e) => updateSearchParams({ type: e.target.value })}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>

              <select
                value={sort}
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="rating.desc">Highest Rated</option>
                <option value="date.desc">Latest Release</option>
              </select>
            </div>

            {/* Genre Filter Buttons */}
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

          {/* Top Ad */}
          <div className="my-8">
            <GoogleAdsense />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item) => (
              item.media_type === 'movie' ? (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
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
                  key={`${item.media_type}-${item.id}`}
                  id={item.id.toString()}
                  name={item.name || ''}
                  poster={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null}
                  year={item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() : 'N/A'}
                  rating={item.vote_average}
                  voteCount={item.vote_count}
                  overview={item.overview}
                />
              )
            ))}
            {/* Middle Ad */}
            {results.length > 10 && (
              <div className="my-8">
                <GoogleAdsense />
              </div>
            )}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <svg
              className="w-16 h-16 text-gray-600"
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
            <p className="text-xl text-gray-400">
              No results found for "{query}"
            </p>
            <p className="text-gray-500">
              Try searching with different keywords or filters
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <svg
              className="w-16 h-16 text-gray-600"
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
            <p className="text-xl text-gray-400">
              Enter a search term to find movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
