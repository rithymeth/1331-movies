import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import GenreFilterBar from '../components/movie/GenreFilterBar';
import CatalogControls from '../components/movie/CatalogControls';
import CatalogPager from '../components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdb, fetchTmdbList, fetchTmdbPage, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { parseCatalogCountry, parseCatalogSort, parseCatalogYear, tmdbSortParam } from '@/app/lib/catalogQuery';

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

export default async function TVShowsPage({
  searchParams
}: {
  searchParams: { genre?: string; page?: string; sort?: string; year?: string; country?: string };
}) {
  const query = {
    genre: searchParams?.genre,
    sort: parseCatalogSort(searchParams?.sort),
    year: parseCatalogYear(searchParams?.year),
    country: parseCatalogCountry(searchParams?.country),
    page: clampTmdbPage(searchParams?.page)
  };
  const filteredView = Boolean(query.genre || query.year || query.country || query.sort !== 'popular' || query.page > 1);
  const [lists, genreData, filteredPage] = await Promise.all([
    filteredView ? Promise.resolve(null) : getTVShows(),
    fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/tv/list', { revalidate: 86400 }),
    filteredView
      ? fetchTmdbPage<TmdbMediaListItem>('/discover/tv', {
          params: {
            with_genres: query.genre,
            sort_by: tmdbSortParam(query.sort, 'tv'),
            first_air_date_year: query.year,
            with_origin_country: query.country,
            include_adult: 'false',
            'vote_count.gte': query.sort === 'rating' ? 80 : undefined,
            page: query.page
          }
        })
      : Promise.resolve({ results: [], page: 1, totalPages: 1 })
  ]);
  const genres = genreData?.genres || [];
  const selectedGenre = genres.find((item) => String(item.id) === query.genre);
  const filtered = mapTmdbMediaCollection(filteredPage.results, 'tv');
  const hero = filteredView ? filtered[0] : lists?.popular[0];

  return (
    <div className="min-h-screen animated-bg">
      <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden">
        {hero?.backdrop ? <Image src={hero.backdrop} alt="" fill className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 flex h-full items-end px-4 pb-10 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Catalog</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">{selectedGenre ? selectedGenre.name : 'TV Shows'}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Filter by genre, year, country, or sort order. Open a series for seasons, similar titles, and official watch options.
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <GenreFilterBar genres={genres} query={query} basePath="/tv-shows" />
        <CatalogControls basePath="/tv-shows" query={query} />
        {filteredView ? (
          <>
            <MediaGrid items={filtered} emptyTitle="No series match these filters" emptyMessage="Try another year, country, sort, or genre." />
            <CatalogPager basePath="/tv-shows" query={query} page={filteredPage.page} totalPages={filteredPage.totalPages} />
          </>
        ) : (
          <>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Popular</h2>
              <MediaGrid items={lists?.popular || []} emptyTitle="No popular series available" emptyMessage="Check back soon for the latest TV picks." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Top rated</h2>
              <MediaGrid items={lists?.topRated || []} emptyTitle="No top rated series available" emptyMessage="Try again later for refreshed TV rankings." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Airing today</h2>
              <MediaGrid items={lists?.airingToday || []} emptyTitle="No series airing today" emptyMessage="Airing episodes will show up here when the feed refreshes." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">On the air</h2>
              <MediaGrid items={lists?.onTheAir || []} emptyTitle="No series currently on the air" emptyMessage="Currently airing shows will appear here when TMDB data is available." />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
