import React from 'react';
import Link from 'next/link';
import MovieCarousel from './components/movie/MovieCarousel';
import HeroCarousel from './components/movie/HeroCarousel';
import ContinueWatching from './components/movie/ContinueWatching';
import BecauseYouWatched from './components/movie/BecauseYouWatched';
import GenreRail from './components/movie/GenreRail';
import PeopleGrid from './components/movie/PeopleGrid';
import { fetchTmdb, fetchTmdbList } from './lib/tmdb';
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
  const [nowPlaying, popular, topRated, trending, upcoming, trendingTv, movieGenres, tvGenres, people, airingToday, onTheAir] = await Promise.all([
    fetchMovies('now_playing'),
    fetchMovies('popular'),
    fetchMovies('top_rated'),
    fetchTrending('movie'),
    fetchUpcomingMovies(),
    fetchTrending('tv'),
    fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/movie/list', { revalidate: 86400 }),
    fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/tv/list', { revalidate: 86400 }),
    fetchTmdbList<{ id: number; name: string; profile_path: string | null; known_for_department?: string }>('/person/popular'),
    fetchTmdbList<TmdbMediaListItem>('/tv/airing_today').then((items) => mapTmdbMediaCollection(items, 'tv')),
    fetchTmdbList<TmdbMediaListItem>('/tv/on_the_air').then((items) => mapTmdbMediaCollection(items, 'tv')),
  ]);

  return (
    <div className="min-h-screen animated-bg">
      <HeroCarousel movies={nowPlaying.slice(0, 5)} />
      <section className="relative z-10 mx-4 -mt-10 mb-14 sm:mx-8 md:-mt-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-white/10 bg-[#11161d] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Your next watch</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Big stories. Zero clutter.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Browse what is trending, jump genres with one tap, or press Ctrl/Cmd + K to search from anywhere.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/airing" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              What is airing
            </Link>
            <Link href="/trending" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10">
              Trending now
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl space-y-16 px-4 py-4 sm:px-8 md:py-10">
        <ContinueWatching />
        <BecauseYouWatched />
        <CatalogSection eyebrow="Schedule" title="Airing today" items={airingToday} href="/airing" />
        <CatalogSection eyebrow="On now" title="Currently on the air" items={onTheAir} href="/airing" />
        {people.length > 0 ? (
          <section className="animate-fade-in-up space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Faces behind the titles</p>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Popular people</h2>
              </div>
              <Link href="/people" className="text-xs font-medium text-slate-500 hover:text-white">View all</Link>
            </div>
            <PeopleGrid people={people.slice(0, 12)} />
          </section>
        ) : null}
        <GenreRail genres={movieGenres?.genres || []} title="Movie genres" hrefBase="/movies" />
        <GenreRail genres={tvGenres?.genres || []} title="TV genres" eyebrow="Series" hrefBase="/tv-shows" />
        <CatalogSection eyebrow="Curated for you" title="Trending movies" items={trending} href="/trending?type=movie" />
        <CatalogSection eyebrow="This week" title="Trending series" items={trendingTv} href="/trending?type=tv" />
        <CatalogSection eyebrow="In theaters" title="Now playing" items={nowPlaying} href="/movies" />
        <CatalogSection eyebrow="Most watched" title="Popular movies" items={popular} href="/movies" />
        <CatalogSection eyebrow="Audience favorites" title="Top rated" items={topRated} href="/movies?sort=rating" />
        <CatalogSection eyebrow="Coming soon" title="Upcoming movies" items={upcoming} href="/movies?sort=date" />
      </div>
    </div>
  );
}
