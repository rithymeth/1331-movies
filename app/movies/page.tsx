import React from 'react';
import MovieCard from '../components/MovieCard';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

async function getMovies() {
  const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`)
  ]);

  const [popular, topRated, upcoming] = await Promise.all([
    popularRes.json(),
    topRatedRes.json(),
    upcomingRes.json()
  ]);

  return {
    popular: popular.results,
    topRated: topRated.results,
    upcoming: upcoming.results
  };
}

export default async function MoviesPage() {
  const { popular, topRated, upcoming } = await getMovies();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${popular[0]?.backdrop_path}`}
          alt="Featured Movie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">Movies</h1>
            <p className="text-base sm:text-xl text-gray-200 max-w-md mx-auto">Discover the latest and greatest in cinema</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Popular Movies */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Popular Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {popular.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                year={movie.release_date?.split('-')[0]}
                rating={movie.vote_average}
                voteCount={movie.vote_count}
                overview={movie.overview}
              />
            ))}
          </div>
        </section>

        {/* Top Rated Movies */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Top Rated Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {topRated.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                year={movie.release_date?.split('-')[0]}
                rating={movie.vote_average}
                voteCount={movie.vote_count}
                overview={movie.overview}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Movies */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Upcoming Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {upcoming.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                year={movie.release_date?.split('-')[0]}
                rating={movie.vote_average}
                voteCount={movie.vote_count}
                overview={movie.overview}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
