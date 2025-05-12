'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VideoPlayerProps {
  embedUrl: string;
  fallbackUrls?: string[];
}

export default function VideoPlayer({ embedUrl, fallbackUrls = [] }: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(embedUrl);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const allSources = [embedUrl, ...fallbackUrls];

  const handleSourceChange = (index: number) => {
    setIsLoading(true);
    setSourceIndex(index);
    setCurrentUrl(allSources[index]);
  };

  const tryNextSource = useCallback(() => {
    if (autoSwitch && sourceIndex < allSources.length - 1) {
      console.log(`Source ${sourceIndex + 1} failed, trying next source...`);
      handleSourceChange(sourceIndex + 1);
    }
  }, [sourceIndex, allSources.length, autoSwitch]);

  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;

    const checkIframeLoaded = () => {
      if (iframeRef.current) {
        try {
          // Try to access iframe content - if blocked, source might be invalid
          const iframeContent = iframeRef.current.contentWindow;
          if (!iframeContent) {
            tryNextSource();
          }
        } catch (error) {
          // CORS error or other issue, try next source
          tryNextSource();
        }
      }
    };

    // Set a timeout to check if the source loads
    errorTimeout = setTimeout(() => {
      setIsLoading(false);
      checkIframeLoaded();
    }, 5000); // Wait 5 seconds before trying next source

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [currentUrl, tryNextSource]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.log(`Source ${sourceIndex + 1} failed to load`);
    tryNextSource();
  };

  const getVideoUrl = () => {
    if (embedUrl.includes('youtube')) {
      return embedUrl;
    } else if (embedUrl.includes('vidsrc')) {
      if (embedUrl.includes('ani')) {
        // Anime episode
        const aniId = embedUrl.split('id=')[1].split('&')[0];
        // Using gogoanime as the source for anime
        return `https://gogoplay4.com/streaming.php?id=${aniId}&ep=1`;
      } else if (embedUrl.includes('tv')) {
        // TV show episode
        const tvId = embedUrl.split('tv/')[1].split('/')[0];
        const season = embedUrl.split('tv/')[1].split('/')[1];
        const episode = embedUrl.split('tv/')[1].split('/')[2];
        return `https://vidsrc.cc/v2/embed/tv/${tvId}/${season}/${episode}`;
      } else {
        // Movie
        const movieId = embedUrl.split('movie/')[1];
        return `https://vidsrc.cc/v2/embed/movie/${movieId}`;
      }
    }
    return '';
  };

  return (
    <div className="w-full aspect-video relative bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={currentUrl}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
      <div className="absolute top-4 right-4 flex flex-wrap gap-2 max-w-full p-2 bg-black/50 rounded-lg">
        <div className="flex items-center space-x-2 mr-4">
          <label className="text-sm text-white">
            <input
              type="checkbox"
              checked={autoSwitch}
              onChange={(e) => setAutoSwitch(e.target.checked)}
              className="mr-2"
            />
            Auto-switch
          </label>
        </div>
        {allSources.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSourceChange(index)}
            className={`px-3 py-1 rounded text-sm ${sourceIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Source {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleSourceChange(sourceIndex)}
          className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-200 hover:bg-gray-600"
          title="Retry current source"
        >
          ↻
        </button>
      </div>
      {sourceIndex > 0 && (
        <div className="absolute bottom-4 left-4 text-sm text-gray-400 bg-black/50 px-3 py-1 rounded-lg">
          Using backup source {sourceIndex + 1}
        </div>
      )}
    </div>
  );
}
