import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MovieCard from './components/MovieCard';

interface RawMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating: number;
  overview: string;
}

async function fetchMovies(endpoint: string): Promise<Movie[]> {
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
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
    rating: movie.vote_average,
    overview: movie.overview
  }));
}

export default async function Home() {
  const [nowPlaying, popular, topRated] = await Promise.all([
    fetchMovies('now_playing'),
    fetchMovies('popular'),
    fetchMovies('top_rated')
  ]);

  const featuredMovie = nowPlaying[0];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        {featuredMovie.backdrop && (
          <>
            <div className="absolute inset-0">
              <Image
                src={featuredMovie.backdrop}
                alt={featuredMovie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-16 space-y-4">
              <h1 className="text-5xl font-bold">{featuredMovie.title}</h1>
              <p className="text-lg max-w-xl text-gray-200">{featuredMovie.overview}</p>
              <div className="flex items-center gap-4">
                <Link 
                  href={`/movie/${featuredMovie.id}`}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play
                </Link>
                <button className="bg-gray-700/80 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
                  More Info
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Movie Sections */}
      <div className="relative z-10 -mt-32 pb-8 space-y-8">
        <div className="px-8 space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {nowPlaying.map((movie) => (
                  <div key={movie.id} className="flex-none w-[200px]">
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {popular.map((movie) => (
                  <div key={movie.id} className="flex-none w-[200px]">
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {topRated.map((movie) => (
                  <div key={movie.id} className="flex-none w-[200px]">
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <svg className="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
          Top Rated Movies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {topRated.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              year={movie.year}
              rating={movie.rating}
              overview={movie.overview}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
