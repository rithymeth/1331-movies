import React from 'react';
import Link from 'next/link';
import { MovieClient } from './MovieClient';
import type { Metadata } from 'next';
import WatchProviders from '@/app/components/movie/WatchProviders';
import ReviewsList from '@/app/components/movie/ReviewsList';
import MediaGrid from '@/app/components/movie/MediaGrid';
import { absoluteUrl } from '@/app/lib/site';
import { fetchTmdb, fetchTmdbList, fetchWatchProviders, getMediaYear, getTmdbImageUrl, TmdbMediaListItem, TmdbWatchProvider } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection, MediaCardItem } from '@/app/lib/media';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  imdb_id: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  belongs_to_collection?: { id: number; name: string } | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);

  try {
    const { movie } = await getMovieDetails(id);
    const releaseYear = getMediaYear(movie.release_date);
    const title = `${movie.title} (${releaseYear}) | 1331 Movies`;
    const description = movie.overview
      ? `${movie.title} (${releaseYear}). ${movie.overview.slice(0, 140)}`
      : `${movie.title} (${releaseYear}) on 1331 Movies.`;
    const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500') || '/og-image.jpg';
    const backdropUrl = getTmdbImageUrl(movie.backdrop_path, 'original') || posterUrl;
    const genres = movie.genres.map((g) => g.name).join(', ');

    return {
      title,
      description,
      keywords: `${movie.title}, ${genres}, ${releaseYear} movies`,
      openGraph: {
        title,
        description,
        type: 'video.movie',
        url: absoluteUrl(`/movie/${id}`),
        siteName: '1331 Movies',
        images: [
          { url: backdropUrl, width: 1920, height: 1080, alt: movie.title },
          { url: posterUrl, width: 500, height: 750, alt: `${movie.title} poster` },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [backdropUrl],
      },
      alternates: {
        canonical: `/movie/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie - 1331 Movies',
      description: 'Browse movie details and trailers on 1331 Movies.',
    };
  }
}

async function getMovieDetails(id: string): Promise<{
  movie: MovieDetails;
  cast: CastMember[];
  videos: Video[];
  similar: MediaCardItem[];
  providers: TmdbWatchProvider[];
  reviews: { id: string; author: string; content: string; created_at?: string }[];
  collectionParts: MediaCardItem[];
}> {
  const [movieRes, externalIdsRes, creditsRes, videosRes, similarRes, providers, reviewsRes] = await Promise.all([
    fetchTmdb<MovieDetails>(`/movie/${id}`),
    fetchTmdb<{ imdb_id?: string }>(`/movie/${id}/external_ids`),
    fetchTmdb<{ cast: CastMember[] }>(`/movie/${id}/credits`),
    fetchTmdb<{ results: Video[] }>(`/movie/${id}/videos`),
    fetchTmdbList<TmdbMediaListItem>(`/movie/${id}/similar`),
    fetchWatchProviders('movie', id),
    fetchTmdb<{ results?: { id: string; author: string; content: string; created_at?: string }[] }>(`/movie/${id}/reviews`),
  ]);

  if (!movieRes) {
    throw new Error('Failed to fetch movie data');
  }

  const collection = movieRes.belongs_to_collection
    ? await fetchTmdb<{ parts?: TmdbMediaListItem[] }>(`/collection/${movieRes.belongs_to_collection.id}`)
    : null;

  const filteredVideos = (videosRes?.results || []).filter(
    (video: Video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );

  return {
    movie: {
      ...movieRes,
      imdb_id: externalIdsRes?.imdb_id || movieRes.imdb_id || '',
    },
    cast: (creditsRes?.cast || []).slice(0, 6),
    videos: filteredVideos,
    similar: mapTmdbMediaCollection(similarRes, 'movie').slice(0, 12),
    providers,
    reviews: reviewsRes?.results || [],
    collectionParts: mapTmdbMediaCollection(collection?.parts || [], 'movie')
      .filter((item) => item.id !== id)
      .slice(0, 12)
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const { movie, cast, videos, similar, providers, reviews, collectionParts } = await getMovieDetails(id);

  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: getTmdbImageUrl(movie.poster_path, 'w500') || undefined,
    datePublished: movie.release_date,
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    genre: movie.genres.map((g) => g.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
      bestRating: 10,
      worstRating: 0,
    },
    actor: cast.map((member) => ({
      '@type': 'Person',
      name: member.name,
      characterName: member.character,
    })),
    url: absoluteUrl(`/movie/${id}`),
    sameAs: movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <MovieClient movie={movie} cast={cast} videos={videos} similar={similar} />
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16">
        {movie.belongs_to_collection ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-white">Part of {movie.belongs_to_collection.name}</h2>
              <Link href={`/collection/${movie.belongs_to_collection.id}`} className="text-xs text-slate-500 hover:text-white">
                View collection
              </Link>
            </div>
            <MediaGrid items={collectionParts} emptyTitle="No other titles yet" emptyMessage="This collection does not list additional movies." />
          </section>
        ) : null}
        <WatchProviders providers={providers} tmdbUrl={`https://www.themoviedb.org/movie/${id}/watch`} />
        <ReviewsList reviews={reviews} />
      </div>
    </>
  );
}
