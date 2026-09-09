import React from 'react';
import { Metadata } from 'next';
import AnimeClient from './AnimeClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}/api/anime/${params.id}`);
    const anime = await response.json();
    
    if (!response.ok) {
      return {
        title: 'Anime Not Found | 1331 Movies',
        description: 'The requested anime could not be found.'
      };
    }

    const animeTitle = anime.title_english || anime.title;
    const title = `${animeTitle} | Watch Anime Online | 1331 Movies`;
    const description = anime.synopsis 
      ? `Watch ${animeTitle} online. ${anime.synopsis.substring(0, 150)}...`
      : `Watch ${animeTitle} anime online for free on 1331 Movies.`;
    
    const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}/anime/${params.id}`;

    return {
      title,
      description,
      keywords: [
        animeTitle,
        'anime',
        'watch anime online',
        'free anime streaming',
        ...(anime.genres?.map((g: any) => g.name) || [])
      ].join(', '),
      openGraph: {
        title,
        description,
        type: 'video.tv_show',
        url: canonicalUrl,
        images: imageUrl ? [{
          url: imageUrl,
          width: 800,
          height: 600,
          alt: animeTitle
        }] : [],
        siteName: '1331 Movies'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : []
      },
      alternates: {
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    return {
      title: 'Anime | 1331 Movies',
      description: 'Watch anime online for free on 1331 Movies.'
    };
  }
}

interface Props {
  params: {
    id: string;
  };
}

export default async function AnimePage({ params }: Props) {
  return (
    <div>
      <AnimeClient animeId={params.id} />
    </div>
  );
}
