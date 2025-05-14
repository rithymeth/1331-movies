'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  embedUrl: string;
  fallbackUrls?: string[];
}

export default function VideoPlayer({ embedUrl, fallbackUrls = [] }: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(embedUrl);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [showSources, setShowSources] = useState(false);
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
      const url = new URL(embedUrl);
      const params = new URLSearchParams(url.search);
      const autoPlay = params.get('autoPlay') || 'true';
      const poster = params.get('poster') || 'true';
      const autoSkipIntro = params.get('autoSkipIntro') || 'false';

      if (url.pathname.includes('/anime/')) {
        // Anime episode
        const [, , , id, episode, type] = url.pathname.split('/');
        // Add proper prefix based on the source
        const prefixedId = id.startsWith('tt') ? `imdb${id}` : 
                          id.startsWith('ani') ? id :
                          id.includes('mal') ? id.replace('mal', '') :
                          id.startsWith('tmdb') ? id : `tmdb${id}`;
        return `https://vidsrc.cc/v2/embed/anime/${prefixedId}/${episode}/${type}?autoPlay=${autoPlay}&autoSkipIntro=${autoSkipIntro}`;
      } else if (url.pathname.includes('/tv')) {
        // TV show episode
        const tmdbId = params.get('tmdb');
        const season = params.get('season');
        const episode = params.get('episode');
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=${autoPlay}&poster=${poster}`;
      } else {
        // Movie
        const [, , , id] = url.pathname.split('/');
        // Add tt prefix for IMDB IDs if not present
        const movieId = id.startsWith('tt') ? id : id.match(/^\d+$/) ? id : `tt${id}`;
        return `https://vidsrc.cc/v2/embed/movie/${movieId}?autoPlay=${autoPlay}&poster=${poster}`;
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
        className="w-full h-full absolute inset-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
      {/* Source Controls - Top */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-gray-900/90 text-white hover:bg-gray-800/90 transition-colors shadow-lg backdrop-blur-sm"
          >
            Source {sourceIndex + 1}
            {showSources ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronUpIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleSourceChange(sourceIndex)}
            className="px-3 py-1.5 rounded text-sm font-medium bg-gray-900/90 text-white hover:bg-gray-800/90 transition-colors shadow-lg backdrop-blur-sm"
            title="Retry current source"
          >
            ↻
          </button>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium bg-gray-900/90 text-white hover:bg-gray-800/90 transition-colors shadow-lg backdrop-blur-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoSwitch}
              onChange={(e) => setAutoSwitch(e.target.checked)}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Auto-switch</span>
          </label>
        </div>
      </div>

      {/* Source Dropdown */}
      {showSources && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-black/90 backdrop-blur-sm z-10">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {allSources.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSourceChange(index);
                  setShowSources(false);
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${sourceIndex === index 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
              >
                Source {index + 1}
              </button>
            ))}
          </div>
          {sourceIndex > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Using backup source {sourceIndex + 1}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
