'use client';

import React from 'react';

interface VideoPlayerProps {
  videoKey: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoKey }) => {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=0&controls=1&modestbranding=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;
