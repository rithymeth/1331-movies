import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MovieClient } from './MovieClient';
import type { Metadata } from 'next';

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
    
    const title = `${movie.title} (${new Date(movie.release_date).getFullYear()}) - Watch Free | 1331 Movies`;
    const description = movie.overview 
      ? `Watch ${movie.title} (${new Date(movie.release_date).getFullYear()}) online for free in HD quality. ${movie.overview.slice(0, 120)}...`
      : `Watch ${movie.title} (${new Date(movie.release_date).getFullYear()}) online for free in HD quality on 1331 Movies.`;
    
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/og-image.jpg';
    
    const backdropUrl = movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : posterUrl;
    
    const genres = movie.genres.map(g => g.name).join(', ');
    const keywords = `${movie.title}, watch ${movie.title}, ${movie.title} online, ${movie.title} free, ${genres}, ${new Date(movie.release_date).getFullYear()} movies, HD movies, streaming`;
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'video.movie',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies.netlify.app'}/movie/${id}`,
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
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
  ]);

  if (!movieRes.ok || !externalIdsRes.ok || !creditsRes.ok || !videosRes.ok) {
    throw new Error('Failed to fetch movie data');
  }

  const [movieData, externalIds, credits, videos] = await Promise.all([
    movieRes.json(),
    externalIdsRes.json(),
    creditsRes.json(),
    videosRes.json()
  ]);

  // Filter for YouTube trailers and teasers
  const filteredVideos = videos.results.filter(
    (video: Video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );

  return {
    movie: {
      ...movieData,
      imdb_id: externalIds.imdb_id,
    },
    cast: credits.cast.slice(0, 6),
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
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
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
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies.netlify.app'}/movie/${id}`,
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
