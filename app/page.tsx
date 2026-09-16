import React from 'react';
import Link from 'next/link';
import MovieCarousel from './components/movie/MovieCarousel';
import HeroCarousel from './components/movie/HeroCarousel';
import ContinueWatching from './components/movie/ContinueWatching';
import { fetchTmdbList } from './lib/tmdb';
import { mapTmdbMediaCollection } from './lib/media';
import { TmdbMediaListItem } from './lib/tmdb';

async function fetchMovies(endpoint: string) {
  const movies = await fetchTmdbList<TmdbMediaListItem>(`/movie/${endpoint}`);
  return mapTmdbMediaCollection(movies, 'movie');
}

async function fetchTrending(mediaType: 'movie' | 'tv') {
  const items = await fetchTmdbList<TmdbMediaListItem>(`/trending/${mediaType}/week`);
  return mapTmdbMediaCollection(items, mediaType);
}

async function fetchUpcomingMovies() {
  const movies = await fetchTmdbList<TmdbMediaListItem>('/movie/upcoming');
  return mapTmdbMediaCollection(movies, 'movie').slice(0, 10);
}

function CatalogSection({
  eyebrow,
  title,
  items,
  href,
}: {
  eyebrow: string;
  title: string;
  items: ReturnType<typeof mapTmdbMediaCollection>;
  href?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up">
      <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        </div>
        {href ? (
          <Link href={href} className="text-xs font-medium text-slate-500 transition hover:text-white">
            View all
          </Link>
        ) : null}
      </div>
      <MovieCarousel movies={items} />
    </section>
  );
}

export default async function Home() {
  const [nowPlaying, popular, topRated, trending, upcoming, trendingTv] = await Promise.all([
    fetchMovies('now_playing'),
    fetchMovies('popular'),
    fetchMovies('top_rated'),
    fetchTrending('movie'),
    fetchUpcomingMovies(),
    fetchTrending('tv'),
  ]);

  return (
    <div className="min-h-screen animated-bg">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <HeroCarousel movies={nowPlaying.slice(0, 5)} />
      <section className="relative z-10 mx-4 -mt-10 mb-14 sm:mx-8 md:-mt-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-white/10 bg-[#11161d] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Your next watch</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Big stories. Zero clutter.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Browse what is trending, save titles to your library, and jump back in from continue watching.
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

      <div className="relative z-10 mx-auto max-w-7xl space-y-16 px-4 py-4 sm:px-8 md:py-10">
        <ContinueWatching />
        <CatalogSection eyebrow="Curated for you" title="Trending movies" items={trending} href="/movies" />
        <CatalogSection eyebrow="This week" title="Trending series" items={trendingTv} href="/tv-shows" />
        <CatalogSection eyebrow="In theaters" title="Now playing" items={nowPlaying} href="/movies" />
        <CatalogSection eyebrow="Most watched" title="Popular movies" items={popular} href="/movies" />
        <CatalogSection eyebrow="Audience favorites" title="Top rated" items={topRated} href="/movies" />
        <CatalogSection eyebrow="Coming soon" title="Upcoming movies" items={upcoming} href="/movies" />

        <section className="text-center py-16 animate-fade-in-up">
          <div className="card-modern p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black gradient-text mb-6">
              Discover your next favorite title
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Search the catalog, filter by genre, and keep a local watchlist on this device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="btn-modern inline-flex items-center gap-2">
                Start exploring
              </Link>
              <Link href="/library" className="btn-modern-accent inline-flex items-center gap-2">
                Open library
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
