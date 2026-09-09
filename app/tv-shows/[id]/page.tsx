import React from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';
import type { Metadata } from 'next';
import TVShowClient from '@/app/tv-shows/[id]/TVShowClient';

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
  genres: Array<{
    id: number;
    name: string;
  }>;
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
  params: {
    id: string;
  };
}

async function getTVShowDetails(id: string): Promise<TVShowDetails> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies.netlify.app'}/api/tv/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch TV show details');
  }
  
  return response.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  
  try {
    const tvShow = await getTVShowDetails(id);
    
    const title = `${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) - Watch Free | 1331 Movies`;
    const description = tvShow.overview 
      ? `Watch ${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) online for free in HD quality. ${tvShow.overview.slice(0, 120)}...`
      : `Watch ${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) online for free in HD quality on 1331 Movies.`;
    
    const posterUrl = tvShow.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
      : '/og-image.jpg';
    
    const backdropUrl = tvShow.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
      : posterUrl;
    
    const genres = tvShow.genres.map(g => g.name).join(', ');
    const keywords = `${tvShow.name}, watch ${tvShow.name}, ${tvShow.name} online, ${tvShow.name} free, ${genres}, ${new Date(tvShow.first_air_date).getFullYear()} tv shows, HD tv shows, streaming, episodes`;
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'video.tv_show',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies.netlify.app'}/tv-shows/${id}`,
        siteName: '1331 Movies',
        images: [
          {
            url: backdropUrl,
            width: 1920,
            height: 1080,
            alt: tvShow.name,
          },
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: `${tvShow.name} poster`,
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
        canonical: `/tv-shows/${id}`,
      },
      other: {
        'tv:release_date': tvShow.first_air_date,
        'tv:genre': genres,
        'tv:rating': tvShow.vote_average.toString(),
        'tv:seasons': tvShow.number_of_seasons.toString(),
        'tv:episodes': tvShow.number_of_episodes.toString(),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'TV Show - 1331 Movies',
      description: 'Watch TV shows online for free in HD quality on 1331 Movies.',
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
        <p className="text-gray-400 mt-2">
          Sorry, this TV show could not be found.
        </p>
      </div>
    );
  }
  
  // Structured data for SEO
  const tvShowSchema = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tvShow.name,
    description: tvShow.overview,
    image: tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : undefined,
    datePublished: tvShow.first_air_date,
    numberOfSeasons: tvShow.number_of_seasons,
    numberOfEpisodes: tvShow.number_of_episodes,
    genre: tvShow.genres.map(g => g.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tvShow.vote_average,
      bestRating: 10,
      worstRating: 0
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies.netlify.app'}/tv-shows/${id}`,
  };
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvShowSchema) }}
      />
      
      <TVShowClient tvShowId={id} initialData={tvShow} />
    </>
  );
}
