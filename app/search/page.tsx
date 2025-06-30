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
    <main className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Explore Movies & TV Shows
        </h1>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <select
                value={type}
                onChange={(e) => updateSearchParams({ type: e.target.value })}
                className="block w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition duration-150 ease-in-out"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
                className="block w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition duration-150 ease-in-out"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="rating.desc">Highest Rated</option>
                <option value="date.desc">Latest Release</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by keyword..."
                value={query}
                onChange={(e) => updateSearchParams({ q: e.target.value })}
                className="block w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {/* Genre Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-20 text-xl">{error}</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
            {/* Middle Ad - Consider adding a proper ad component or remove if not needed */}
            {results.length > 10 && (
              <div className="col-span-full my-8 text-center text-gray-500">
                {/* Ad goes here */}
              </div>
            )}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg
              className="w-20 h-20 text-gray-600"
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
            <p className="text-2xl text-gray-400 font-semibold">
              No results found for "{query}"
            </p>
            <p className="text-lg text-gray-500">
              Try searching with different keywords or filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg
              className="w-20 h-20 text-gray-600"
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
            <p className="text-2xl text-gray-400 font-semibold">
              Start your search
            </p>
            <p className="text-lg text-gray-500">
              Enter a keyword to find movies and TV shows.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
