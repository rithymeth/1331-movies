import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import { fetchTmdbList } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { TmdbMediaListItem } from '@/app/lib/tmdb';

async function getTVShows() {
  return {
    popular: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/tv/popular'), 'tv'),
    topRated: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/tv/top_rated'), 'tv'),
    airingToday: mapTmdbMediaCollection(await fetchTmdbList<TmdbMediaListItem>('/tv/airing_today'), 'tv')
  };
}

export default async function TVShowsPage() {
  const { popular, topRated, airingToday } = await getTVShows();

  return (
    <div className="min-h-screen animated-bg">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-indigo-500/2 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
        {popular[0]?.backdrop && <Image
          src={popular[0].backdrop}
          alt="Featured TV Show"
          fill
          className="object-cover"
          priority
        />}
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center space-y-6 animate-slide-up">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black gradient-text leading-tight">
              TV Shows
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Discover your next binge-worthy series
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-white font-semibold">{popular.length}+ Series</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-semibold">HD Streaming</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        {/* Popular TV Shows */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Popular TV Shows</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={popular} emptyTitle="No popular series available" emptyMessage="Check back soon for the latest TV picks." />
        </section>

        {/* Top Rated TV Shows */}
        <section className="animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Top Rated TV Shows</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={topRated} emptyTitle="No top rated series available" emptyMessage="Try again later for refreshed TV rankings." />
        </section>

        {/* Airing Today */}
        <section className="animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Airing Today</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          <MediaGrid items={airingToday} emptyTitle="No series airing today" emptyMessage="Airing episodes will show up here when the feed refreshes." />
        </section>
      </div>
    </div>
  );
}
