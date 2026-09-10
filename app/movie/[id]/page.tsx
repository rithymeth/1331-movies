import React from 'react';
import { MovieClient } from './MovieClient';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/app/lib/site';
import { fetchTmdb, getMediaYear, getTmdbImageUrl } from '@/app/lib/tmdb';

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
    const title = `${movie.title} (${releaseYear}) - Watch Free | 1331 Movies`;
    const description = movie.overview 
      ? `Watch ${movie.title} (${releaseYear}) online for free in HD quality. ${movie.overview.slice(0, 120)}...`
      : `Watch ${movie.title} (${releaseYear}) online for free in HD quality on 1331 Movies.`;
    
    const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500') || '/og-image.jpg';
    
    const backdropUrl = getTmdbImageUrl(movie.backdrop_path, 'original') || posterUrl;
    
    const genres = movie.genres.map(g => g.name).join(', ');
    const keywords = `${movie.title}, watch ${movie.title}, ${movie.title} online, ${movie.title} free, ${genres}, ${releaseYear} movies, HD movies, streaming`;
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'video.movie',
        url: absoluteUrl(`/movie/${id}`),
        siteName: '1331 Movies',
        images: [
          {
            url: backdropUrl,
            width: 1920,
            height: 1080,
            alt: movie.title,
          },
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: `${movie.title} poster`,
          },
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
      other: {
        'movie:release_date': movie.release_date,
        'movie:duration': movie.runtime.toString(),
        'movie:genre': genres,
        'movie:rating': movie.vote_average.toString(),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie - 1331 Movies',
      description: 'Watch movies online for free in HD quality on 1331 Movies.',
    };
  }
}

async function getMovieDetails(id: string): Promise<{ movie: MovieDetails; cast: CastMember[]; videos: Video[] }> {
  const [movieRes, externalIdsRes, creditsRes, videosRes] = await Promise.all([
    fetchTmdb<MovieDetails>(`/movie/${id}`),
    fetchTmdb<{ imdb_id: string }>(`/movie/${id}/external_ids`),
    fetchTmdb<{ cast: CastMember[] }>(`/movie/${id}/credits`),
    fetchTmdb<{ results: Video[] }>(`/movie/${id}/videos`)
  ]);

  if (!movieRes || !externalIdsRes || !creditsRes || !videosRes) {
    throw new Error('Failed to fetch movie data');
  }

  // Filter for YouTube trailers and teasers
  const filteredVideos = (videosRes.results || []).filter(
    (video: Video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );

  return {
    movie: {
      ...movieRes,
      imdb_id: externalIdsRes.imdb_id,
    },
    cast: (creditsRes.cast || []).slice(0, 6),
    videos: filteredVideos
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const { movie, cast, videos } = await getMovieDetails(id);

  if (!movie.imdb_id) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        {movie && (
          <div className="container mx-auto px-4 py-8">
            {/* Dropdown Ad */}
          </div>
        )}
        <h1 className="text-2xl font-bold text-red-500">Movie Not Available</h1>
        <p className="text-gray-400 mt-2">
          Sorry, this movie is not available for streaming.
        </p>
      </div>
    );
  }

  // Structured data for SEO
  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: getTmdbImageUrl(movie.poster_path, 'w500') || undefined,
    datePublished: movie.release_date,
    duration: `PT${movie.runtime}M`,
    genre: movie.genres.map(g => g.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
      bestRating: 10,
      worstRating: 0
    },
    actor: cast.map(member => ({
      '@type': 'Person',
      name: member.name,
      characterName: member.character
    })),
    url: absoluteUrl(`/movie/${id}`),
    sameAs: movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : undefined
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      
      <MovieClient movie={movie} cast={cast} videos={videos} />
    </>
  );
}
