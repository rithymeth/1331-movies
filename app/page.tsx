import React from 'react';
import MovieCarousel from './components/MovieCarousel';
import HeroCarousel from './components/HeroCarousel';

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
    `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch movies:', await res.text());
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
      {/* Hero Carousel Section */}
      <HeroCarousel movies={nowPlaying.slice(0, 5)} />
      {/* Movie Sections */}
      <div className="relative z-10 pb-8 bg-gradient-to-b from-black to-gray-900">
        <div className="px-8 space-y-16 max-w-7xl mx-auto py-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 text-white">Now Playing</h2>
            <div className="relative">
              <MovieCarousel movies={nowPlaying} />
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-white">Popular Movies</h2>
            <div className="relative">
              <MovieCarousel movies={popular} />
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-white">Top Rated</h2>
            <div className="relative">
              <MovieCarousel movies={topRated} />
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
        <MovieCarousel movies={topRated} />
      </div>

    </div>
  );
}
