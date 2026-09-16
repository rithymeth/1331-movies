import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import GenreFilterBar from '../components/movie/GenreFilterBar';
import CatalogControls from '../components/movie/CatalogControls';
import CatalogPager from '../components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdb, fetchTmdbList, fetchTmdbPage, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { parseCatalogCountry, parseCatalogLanguage, parseCatalogSort, parseCatalogYear, tmdbSortParam } from '@/app/lib/catalogQuery';

async function getMovies() {
  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    fetchTmdbList<TmdbMediaListItem>('/movie/popular'),
    fetchTmdbList<TmdbMediaListItem>('/movie/top_rated'),
    fetchTmdbList<TmdbMediaListItem>('/movie/upcoming'),
    fetchTmdbList<TmdbMediaListItem>('/movie/now_playing')
  ]);

  return {
    popular: mapTmdbMediaCollection(popular, 'movie'),
    topRated: mapTmdbMediaCollection(topRated, 'movie'),
    upcoming: mapTmdbMediaCollection(upcoming, 'movie'),
    nowPlaying: mapTmdbMediaCollection(nowPlaying, 'movie')
  };
}

export default async function MoviesPage({
  searchParams
}: {
  searchParams: { genre?: string; page?: string; sort?: string; year?: string; country?: string; language?: string };
}) {
  const query = {
    genre: searchParams?.genre,
    sort: parseCatalogSort(searchParams?.sort),
    year: parseCatalogYear(searchParams?.year),
    country: parseCatalogCountry(searchParams?.country),
    language: parseCatalogLanguage(searchParams?.language),
    page: clampTmdbPage(searchParams?.page)
  };
  const filteredView = Boolean(query.genre || query.year || query.country || query.language || query.sort !== 'popular' || query.page > 1);
  const [lists, genreData, filteredPage] = await Promise.all([
    filteredView ? Promise.resolve(null) : getMovies(),
    fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/movie/list', { revalidate: 86400 }),
    filteredView
      ? fetchTmdbPage<TmdbMediaListItem>('/discover/movie', {
          params: {
            with_genres: query.genre,
            sort_by: tmdbSortParam(query.sort, 'movie'),
            primary_release_year: query.year,
            with_origin_country: query.country,
            with_original_language: query.language,
            include_adult: 'false',
            'vote_count.gte': query.sort === 'rating' ? 80 : undefined,
            page: query.page
          }
        })
      : Promise.resolve({ results: [], page: 1, totalPages: 1 })
  ]);
  const genres = genreData?.genres || [];
  const selectedGenre = genres.find((item) => String(item.id) === query.genre);
  const filtered = mapTmdbMediaCollection(filteredPage.results, 'movie');
  const hero = filteredView ? filtered[0] : lists?.popular[0];

  return (
    <div className="min-h-screen animated-bg">
      <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden">
        {hero?.backdrop ? <Image src={hero.backdrop} alt="" fill className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 flex h-full items-end px-4 pb-10 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Catalog</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">{selectedGenre ? selectedGenre.name : 'Movies'}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Filter by genre, year, country, language, or sort order.</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <GenreFilterBar genres={genres} query={query} basePath="/movies" />
        <CatalogControls basePath="/movies" query={query} />
        {filteredView ? (
          <>
            <MediaGrid items={filtered} emptyTitle="No titles match these filters" emptyMessage="Try another year, country, language, sort, or genre." />
            <CatalogPager basePath="/movies" query={query} page={filteredPage.page} totalPages={filteredPage.totalPages} />
          </>
        ) : (
          <>
            <section><h2 className="mb-6 text-3xl font-bold text-white">Popular</h2><MediaGrid items={lists?.popular || []} emptyTitle="No popular movies available" emptyMessage="Check back soon for the latest movie picks." /></section>
            <section><h2 className="mb-6 text-3xl font-bold text-white">Now playing</h2><MediaGrid items={lists?.nowPlaying || []} emptyTitle="Nothing in theaters" emptyMessage="Now playing titles will appear when TMDB data is available." /></section>
            <section><h2 className="mb-6 text-3xl font-bold text-white">Top rated</h2><MediaGrid items={lists?.topRated || []} emptyTitle="No top rated movies available" emptyMessage="Try again later for refreshed movie rankings." /></section>
            <section><h2 className="mb-6 text-3xl font-bold text-white">Upcoming</h2><MediaGrid items={lists?.upcoming || []} emptyTitle="No upcoming movies available" emptyMessage="Upcoming releases will appear here when TMDB data is available." /></section>
          </>
        )}
      </div>
    </div>
  );
}
