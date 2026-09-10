import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import { fetchTmdbList } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { TmdbMediaListItem } from '@/app/lib/tmdb';

async function getMovies() {
  return {
    popular: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/movie/popular'), 'movie'),
    topRated: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/movie/top_rated'), 'movie'),
    upcoming: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/movie/upcoming'), 'movie')
  };
}

export default async function MoviesPage() {
  const { popular, topRated, upcoming } = await getMovies();

  return (
    <div className="min-h-screen animated-bg">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-accent-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-red-500/2 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
        {popular[0]?.backdrop && <Image
          src={popular[0].backdrop}
          alt="Featured Movie"
          fill
          className="object-cover transition-transform duration-[15s] ease-out scale-105 hover:scale-110"
          priority
        />}
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center space-y-6 animate-slide-up">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black gradient-text leading-tight">
              Movies
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Discover the latest and greatest in cinema
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-semibold">{popular.length}+ Popular</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-semibold">HD Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        {/* Popular Movies */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-accent-500 to-primary-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Popular Movies</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={popular} emptyTitle="No popular movies available" emptyMessage="Check back soon for the latest movie picks." />
        </section>

        {/* Top Rated Movies */}
        <section className="animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Top Rated Movies</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={topRated} emptyTitle="No top rated movies available" emptyMessage="Try again later for refreshed movie rankings." />
        </section>

        {/* Upcoming Movies */}
        <section className="animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Upcoming Movies</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={upcoming} emptyTitle="No upcoming movies available" emptyMessage="Upcoming releases will appear here when TMDB data is available." />
        </section>
      </div>
    </div>
  );
}
