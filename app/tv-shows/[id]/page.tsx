import React from 'react';
import type { Metadata } from 'next';
import TVShowClient from '@/app/tv-shows/[id]/TVShowClient';
import MovieCarousel from '@/app/components/movie/MovieCarousel';
import WatchProviders from '@/app/components/movie/WatchProviders';
import CastRail from '@/app/components/movie/CastRail';
import ReviewsList from '@/app/components/movie/ReviewsList';
import KeywordChips from '@/app/components/movie/KeywordChips';
import LinkChips from '@/app/components/movie/LinkChips';
import { absoluteUrl } from '@/app/lib/site';
import { fetchTmdb, fetchTmdbList, fetchWatchProviders, getMediaYear, getTmdbImageUrl, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

interface TVShowDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  genres: Array<{ id: number; name: string }>;
  networks?: Array<{ id: number; name: string }>;
  seasons: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    overview: string;
    poster_path: string;
    episodes: Array<{
      id: number;
      name: string;
      episode_number: number;
      overview: string;
      still_path: string;
      air_date: string;
    }>;
  }>;
}

interface Props {
  params: { id: string };
}

async function getTVShowDetails(id: string): Promise<TVShowDetails> {
  const response = await fetchTmdb<TVShowDetails>(`/tv/${id}`);
  if (!response) {
    throw new Error('Failed to fetch TV show details');
  }

  const firstSeason = (response.seasons || []).find((season) => season.season_number > 0);
  const firstSeasonData = firstSeason
    ? await fetchTmdb<{ episodes?: TVShowDetails['seasons'][number]['episodes'] }>(`/tv/${id}/season/${firstSeason.season_number}`)
    : null;

  return {
    ...response,
    seasons: (response.seasons || []).map((season) => ({
      ...season,
      episodes: season.season_number === firstSeason?.season_number ? firstSeasonData?.episodes || [] : []
    }))
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);

  try {
    const tvShow = await fetchTmdb<TVShowDetails>(`/tv/${id}`);
    if (!tvShow) {
      throw new Error('Missing TV show');
    }
    const releaseYear = getMediaYear(tvShow.first_air_date);
    const title = `${tvShow.name} (${releaseYear}) | 1331 Movies`;
    const description = tvShow.overview
      ? `${tvShow.name} (${releaseYear}). ${tvShow.overview.slice(0, 140)}`
      : `${tvShow.name} (${releaseYear}) on 1331 Movies.`;
    const posterUrl = getTmdbImageUrl(tvShow.poster_path, 'w500') || '/og-image.jpg';
    const backdropUrl = getTmdbImageUrl(tvShow.backdrop_path, 'original') || posterUrl;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'video.tv_show',
        url: absoluteUrl(`/tv-shows/${id}`),
        siteName: '1331 Movies',
        images: [{ url: backdropUrl, width: 1920, height: 1080, alt: tvShow.name }]
      },
      alternates: { canonical: `/tv-shows/${id}` }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TV Show - 1331 Movies',
      description: 'Browse TV show details on 1331 Movies.'
    };
  }
}

export default async function TVShowPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  let tvShow: TVShowDetails | null = null;
  try {
    tvShow = await getTVShowDetails(id);
  } catch (error) {
    console.error('Error fetching TV show:', error);
  }

  if (!tvShow) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">TV Show Not Found</h1>
        <p className="text-gray-400 mt-2">Sorry, this TV show could not be found.</p>
      </div>
    );
  }

  const [similar, providers, credits, reviews, keywords] = await Promise.all([
    fetchTmdbList<TmdbMediaListItem>(`/tv/${id}/similar`),
    fetchWatchProviders('tv', id),
    fetchTmdb<{ cast?: { id: number; name: string; character: string; profile_path: string | null }[] }>(`/tv/${id}/credits`),
    fetchTmdb<{ results?: { id: string; author: string; content: string; created_at?: string }[] }>(`/tv/${id}/reviews`),
    fetchTmdb<{ results?: { id: number; name: string }[] }>(`/tv/${id}/keywords`)
  ]);

  const tvShowSchema = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tvShow.name,
    description: tvShow.overview,
    image: getTmdbImageUrl(tvShow.poster_path, 'w500') || undefined,
    datePublished: tvShow.first_air_date,
    numberOfSeasons: tvShow.number_of_seasons,
    numberOfEpisodes: tvShow.number_of_episodes,
    genre: tvShow.genres.map((g) => g.name),
    url: absoluteUrl(`/tv-shows/${id}`)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvShowSchema) }} />
      <TVShowClient tvShowId={id} initialData={tvShow} />
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16">
        <KeywordChips keywords={keywords?.results || []} />
        <LinkChips title="Networks" items={(tvShow.networks || []).map((network) => ({ id: network.id, name: network.name, href: `/network/${network.id}` }))} />
        <CastRail cast={credits?.cast || []} />
        <WatchProviders providers={providers} tmdbUrl={`https://www.themoviedb.org/tv/${id}/watch`} />
        <ReviewsList reviews={reviews?.results || []} />
        {similar.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">More like this</h2>
            <MovieCarousel movies={mapTmdbMediaCollection(similar, 'tv').slice(0, 12)} />
          </section>
        ) : null}
      </div>
    </>
  );
}
