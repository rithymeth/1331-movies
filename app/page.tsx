import React from 'react';
import Link from 'next/link';
import MovieCard from './components/MovieCard';
import AdcashAd from './components/AdcashAd';

interface RawMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

async function fetchMovies(endpoint: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const data = await res.json();
  return data.results.map((movie: RawMovie) => ({
    id: movie.id.toString(),
    title: movie.title,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    overview: movie.overview
  }));
}

export default async function Home() {
  const [popularMovies, trendingMovies, topRatedMovies] = await Promise.all([
    fetchMovies('popular'),
    fetchMovies('now_playing'),
    fetchMovies('top_rated')
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-ken-burns" 
            style={{
              backgroundImage: `url(${popularMovies[0]?.poster})`,
              filter: 'blur(8px)',
              transform: 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-black/60" />
        </div>
        
        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
                1331-Movie
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 animate-fade-in-delay">
              Your Ultimate Streaming Destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
              <Link href="/search?type=movie" 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center 
                transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                Browse Movies
              </Link>
              <Link href="/search?type=tv" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center 
                transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Explore TV Shows
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="container mx-auto px-4 py-8">
        <AdcashAd />
      </div>

      {/* Popular Movies */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
              Popular Movies
            </span>
          </h2>
          <Link href="/search?type=movie&sort=popular" 
            className="text-gray-400 hover:text-white transition-colors duration-300">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          {popularMovies.slice(0, 10).map((movie) => (
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
      </section>

      {/* Now Playing */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
              Now Playing
            </span>
          </h2>
          <Link href="/search?type=movie&sort=now_playing" 
            className="text-gray-400 hover:text-white transition-colors duration-300">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          {trendingMovies.slice(0, 10).map((movie) => (
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
      </section>

      {/* Ad Section */}
      <div className="container mx-auto px-4 py-8">
        <AdcashAd />
      </div>

      {/* Top Rated */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
              Top Rated
            </span>
          </h2>
          <Link href="/search?type=movie&sort=top_rated" 
            className="text-gray-400 hover:text-white transition-colors duration-300">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          {topRatedMovies.slice(0, 10).map((movie) => (
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
      </section>

      {/* Final Ad Section */}
      <div className="container mx-auto px-4 py-8">
        <AdcashAd />
      </div>
    </div>
  );
}
