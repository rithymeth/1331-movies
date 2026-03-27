import React from 'react';
import MovieCarousel from './components/movie/MovieCarousel';
import HeroCarousel from './components/movie/HeroCarousel';

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

async function fetchTrendingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `http://localhost:3000/api/trending/movie?time_window=week`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch trending movies:', await res.text());
    throw new Error('Failed to fetch trending movies');
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

async function fetchUpcomingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `http://localhost:3000/api/upcoming/movie`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch upcoming movies:', await res.text());
    throw new Error('Failed to fetch upcoming movies');
  }

  const data = await res.json();
  return data.results.slice(0, 10).map((movie: RawMovie) => ({
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
  const [nowPlaying, popular, topRated, trending, upcoming] = await Promise.all([
    fetchMovies('now_playing'),
    fetchMovies('popular'),
    fetchMovies('top_rated'),
    fetchTrendingMovies(),
    fetchUpcomingMovies()
  ]);

  return (
    <div className="min-h-screen animated-bg">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Carousel Section */}
      <HeroCarousel movies={nowPlaying.slice(0, 5)} />
      {/* Trending Movies Section */}
      <div className="relative z-10 -mt-32 px-4 sm:px-8 mb-20">
        <section className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black gradient-text-warning tracking-tight">Trending This Week</h2>
          </div>
          <MovieCarousel movies={trending} />
        </section>
      </div>
      {/* Main Content Sections */}
      <div className="relative z-10 -mt-20 px-4 sm:px-8 space-y-20 max-w-7xl mx-auto py-12 md:py-20">
        {/* Now Playing Section */}
        <section className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3-3h3m-6 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black gradient-text tracking-tight">Now Playing</h2>
          </div>
          <MovieCarousel movies={nowPlaying} />
        </section>

        {/* Popular Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black gradient-text-accent tracking-tight">Popular Movies</h2>
          </div>
          <MovieCarousel movies={popular} />
        </section>

        {/* Top Rated Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black gradient-text-primary tracking-tight">Top Rated Movies</h2>
          </div>
          <MovieCarousel movies={topRated} />
        </section>

        {/* Upcoming Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black gradient-text-success tracking-tight">Upcoming Movies</h2>
          </div>
          <MovieCarousel movies={upcoming} />
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="card-modern p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black gradient-text mb-6">
              Discover Your Next Favorite Movie
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Explore thousands of movies and TV shows with our advanced search and recommendation system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/search"
                className="btn-modern inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Exploring
              </a>
              <a
                href="/movies"
                className="btn-modern-accent inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                </svg>
                Browse Movies
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
