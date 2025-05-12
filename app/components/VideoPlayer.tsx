'use client';

import React from 'react';

interface VideoPlayerProps {
  videoKey: string;
  type?: 'youtube' | 'vidsrc';
  tmdbId?: string;
  imdbId?: string;
  season?: number;
  episode?: number;
  subType?: 'sub' | 'dub';
}

export default function VideoPlayer({ videoKey, type = 'youtube', tmdbId, imdbId, season, episode, subType = 'sub' }: VideoPlayerProps) {
  const getVideoUrl = () => {
    if (type === 'youtube') {
      return `https://www.youtube.com/embed/${videoKey}?autoplay=0&controls=1&modestbranding=1`;
    } else if (type === 'vidsrc') {
      if (imdbId?.startsWith('ani')) {
        // Anime episode
        const aniId = imdbId.replace('ani', '');
        // Using gogoanime as the source for anime
        return `https://gogoplay4.com/streaming.php?id=${aniId}&ep=${episode}`;
      } else if (season && episode) {
        // TV show episode
        return `https://vidsrc.cc/v2/embed/tv/${imdbId}/${season}/${episode}`;
      } else {
        // Movie
        return `https://vidsrc.cc/v2/embed/movie/${imdbId}`;
      }
    }
    return '';
  };

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
      <iframe
        className="w-full h-full"
        src={getVideoUrl()}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
