import React from 'react';
import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import GenreFilterBar from '../components/movie/GenreFilterBar';
import CatalogPager from '../components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdb, fetchTmdbList, fetchTmdbPage } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';
import { TmdbMediaListItem } from '@/app/lib/tmdb';

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
  searchParams: { genre?: string; page?: string };
}) {
  const genre = searchParams?.genre;
  const page = clampTmdbPage(searchParams?.page);
  const [lists, genreData] = await Promise.all([
    getMovies(),
    fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/movie/list', { revalidate: 86400 })
  ]);
  const genres = genreData?.genres || [];
  const selectedGenre = genres.find((item) => String(item.id) === genre);
  const filteredPage = genre
    ? await fetchTmdbPage<TmdbMediaListItem>('/discover/movie', {
        params: {
          with_genres: genre,
          sort_by: 'popularity.desc',
          include_adult: 'false',
          page
        }
      })
    : { results: [], page: 1, totalPages: 1 };
  const filtered = mapTmdbMediaCollection(filteredPage.results, 'movie');
  const hero = genre ? filtered[0] : lists.popular[0];

  return (
    <div className="min-h-screen animated-bg">
      <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden">
        {hero?.backdrop ? <Image src={hero.backdrop} alt="" fill className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 flex h-full items-end px-4 pb-10 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Catalog</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">{selectedGenre ? selectedGenre.name : 'Movies'}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {selectedGenre ? `Popular ${selectedGenre.name.toLowerCase()} titles from TMDB.` : 'Popular, top rated, in theaters, and coming soon.'}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-8">
        <GenreFilterBar genres={genres} selected={genre} basePath="/movies" />
        {genre ? (
          <>
            <MediaGrid items={filtered} emptyTitle="No titles in this genre" emptyMessage="Try another genre chip above." />
            <CatalogPager basePath="/movies" genre={genre} page={filteredPage.page} totalPages={filteredPage.totalPages} />
          </>
        ) : (
          <>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Popular</h2>
              <MediaGrid items={lists.popular} emptyTitle="No popular movies available" emptyMessage="Check back soon for the latest movie picks." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Now playing</h2>
              <MediaGrid items={lists.nowPlaying} emptyTitle="Nothing in theaters" emptyMessage="Now playing titles will appear when TMDB data is available." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Top rated</h2>
              <MediaGrid items={lists.topRated} emptyTitle="No top rated movies available" emptyMessage="Try again later for refreshed movie rankings." />
            </section>
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white">Upcoming</h2>
              <MediaGrid items={lists.upcoming} emptyTitle="No upcoming movies available" emptyMessage="Upcoming releases will appear here when TMDB data is available." />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
