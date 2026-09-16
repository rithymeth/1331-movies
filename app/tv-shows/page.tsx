import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import { fetchTmdbList } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { TmdbMediaListItem } from '@/app/lib/tmdb';

async function getTVShows() {
  const [popular, topRated, airingToday, onTheAir] = await Promise.all([
    fetchTmdbList<TmdbMediaListItem>('/tv/popular'),
    fetchTmdbList<TmdbMediaListItem>('/tv/top_rated'),
    fetchTmdbList<TmdbMediaListItem>('/tv/airing_today'),
    fetchTmdbList<TmdbMediaListItem>('/tv/on_the_air')
  ]);

  return {
    popular: mapTmdbMediaCollection(popular, 'tv'),
    topRated: mapTmdbMediaCollection(topRated, 'tv'),
    airingToday: mapTmdbMediaCollection(airingToday, 'tv'),
    onTheAir: mapTmdbMediaCollection(onTheAir, 'tv')
  };
}

export default async function TVShowsPage() {
  const { popular, topRated, airingToday, onTheAir } = await getTVShows();

  return (
    <div className="min-h-screen animated-bg">
      <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
        {popular[0]?.backdrop && (
          <Image src={popular[0].backdrop} alt="Featured TV Show" fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black gradient-text leading-tight">TV Shows</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">Discover your next series</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Popular TV Shows</h2>
          <MediaGrid items={popular} emptyTitle="No popular series available" emptyMessage="Check back soon for the latest TV picks." />
        </section>
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Top Rated TV Shows</h2>
          <MediaGrid items={topRated} emptyTitle="No top rated series available" emptyMessage="Try again later for refreshed TV rankings." />
        </section>
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Airing Today</h2>
          <MediaGrid items={airingToday} emptyTitle="No series airing today" emptyMessage="Airing episodes will show up here when the feed refreshes." />
        </section>
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">On The Air</h2>
          <MediaGrid items={onTheAir} emptyTitle="No series currently on the air" emptyMessage="Currently airing shows will appear here when TMDB data is available." />
        </section>
      </div>
    </div>
  );
}
