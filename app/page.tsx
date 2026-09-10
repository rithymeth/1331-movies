import React from 'react';
import Link from 'next/link';
import MovieCarousel from './components/movie/MovieCarousel';
import HeroCarousel from './components/movie/HeroCarousel';
import { fetchTmdbList } from './lib/tmdb';
import { mapTmdbMediaCollection } from './lib/media';
import { TmdbMediaListItem } from './lib/tmdb';

async function fetchMovies(endpoint: string) {
  const movies = await fetchTmdbList<TmdbMediaListItem>(`/movie/${endpoint}`);
  return mapTmdbMediaCollection(movies, 'movie');
}

async function fetchTrendingMovies() {
  const movies = await fetchTmdbList<TmdbMediaListItem>('/trending/movie/week');
  return mapTmdbMediaCollection(movies, 'movie');
}

async function fetchUpcomingMovies() {
  const movies = await fetchTmdbList<TmdbMediaListItem>('/movie/upcoming');
  return mapTmdbMediaCollection(movies, 'movie').slice(0, 10);
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
      <section className="relative z-10 mx-4 -mt-10 mb-14 sm:mx-8 md:-mt-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-white/10 bg-[#11161d] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Your next watch</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Big stories. Zero clutter.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Discover what is trending, then settle in with our HD player powered by Vidking.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/movies" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              Browse movies
            </Link>
            <Link href="/tv-shows" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10">
              Explore series
            </Link>
          </div>
        </div>
      </section>
      {/* Trending Movies Section */}
      <div className="relative z-10 px-4 sm:px-8 mb-16">
        <section className="animate-fade-in-up">
            <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Curated for you</p>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Trending this week</h2>
              </div>
              <span className="text-xs font-medium text-slate-500">Updated daily</span>
            </div>
          <MovieCarousel movies={trending} />
        </section>
      </div>
      {/* Main Content Sections */}
      <div className="relative z-10 px-4 sm:px-8 space-y-16 max-w-7xl mx-auto py-4 md:py-10">
        {/* Now Playing Section */}
        <section className="animate-fade-in-up">
          <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <div className="hidden w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3-3h3m-6 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">In theaters</p><h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Now playing</h2></div>
          </div>
          <MovieCarousel movies={nowPlaying} />
        </section>

        {/* Popular Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <div className="hidden w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Most watched</p><h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Popular movies</h2></div>
          </div>
          <MovieCarousel movies={popular} />
        </section>

        {/* Top Rated Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <div className="hidden w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Audience favorites</p><h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Top rated</h2></div>
          </div>
          <MovieCarousel movies={topRated} />
        </section>

        {/* Upcoming Movies Section */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <div className="hidden w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Coming soon</p><h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Upcoming movies</h2></div>
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
