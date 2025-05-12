import React from 'react';
import MovieCard from '../components/MovieCard';

async function searchMovies(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await res.json();
  return data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A'
  }));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const movies = query ? await searchMovies(query) : [];

  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4">
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              {query ? `Search Results for "${query}"` : 'Search Movies'}
            </h1>
            {movies.length > 0 && (
              <span className="text-gray-400 text-lg">
                {movies.length} {movies.length === 1 ? 'result' : 'results'} found
              </span>
            )}
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster={movie.poster}
                  year={movie.year}
                  rating={movie.rating}
                  voteCount={movie.voteCount}
                  overview={movie.overview}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              {query ? (
                <>
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
                    No movies found for "{query}"
                  </p>
                  <p className="text-gray-500">
                    Try searching with different keywords
                  </p>
                </>
              ) : (
                <>
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
                    Enter a search term to find movies
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
