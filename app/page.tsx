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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Carousel Section */}
      <HeroCarousel movies={nowPlaying.slice(0, 5)} />

      {/* Main Content Sections */}
      <div className="relative z-10 -mt-20 px-4 sm:px-8 space-y-16 max-w-7xl mx-auto py-12 md:py-20">
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white tracking-tight">Now Playing</h2>
          <MovieCarousel movies={nowPlaying} />
        </section>

        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white tracking-tight">Popular Movies</h2>
          <MovieCarousel movies={popular} />
        </section>

        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white tracking-tight">Top Rated Movies</h2>
          <MovieCarousel movies={topRated} />
        </section>
      </div>
    </div>
  );
}
