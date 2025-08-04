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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Set a timeout to automatically try next source if current one doesn't load
    timeoutRef.current = setTimeout(() => {
      if (autoSwitch && sourceIndex < allSources.length - 1) {
        console.log(`Source ${sourceIndex + 1} took too long to load, trying next source...`);
        tryNextSource();
      } else {
        setIsLoading(false);
      }
    }, 8000); // Wait 8 seconds before trying next source

    // Set loading to false after a reasonable time
    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [currentUrl, tryNextSource, autoSwitch, sourceIndex, allSources.length]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Clear the auto-switch timeout since the iframe loaded successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    console.log(`Source ${sourceIndex + 1} loaded successfully`);
  };

  const handleIframeError = () => {
    console.log(`Source ${sourceIndex + 1} failed to load`);
    setIsLoading(false);
    if (autoSwitch) {
      tryNextSource();
    }
  };

  const getVideoUrl = () => {
    // Return the current URL as-is since we're now providing properly formatted URLs
    return currentUrl;
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
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSourceChange(sourceIndex)}
              className="px-2 py-1 rounded text-xs bg-gray-800/90 text-gray-200 hover:bg-gray-700 transition-colors"
              title="Retry current source"
            >
              ↻
            </button>
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-800/90 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              Source {sourceIndex + 1}
              {showSources ? (
                <ChevronDownIcon className="w-3 h-3" />
              ) : (
                <ChevronUpIcon className="w-3 h-3" />
              )}
            </button>
            <label className="text-xs text-gray-200 flex items-center bg-gray-800/90 px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={autoSwitch}
                onChange={(e) => setAutoSwitch(e.target.checked)}
                className="mr-1 h-3 w-3"
              />
              Auto
            </label>
          </div>
        </div>

        {/* Source dropdown */}
        {showSources && (
          <div className="absolute top-12 right-3 bg-gray-800/95 rounded-lg shadow-lg p-2 z-30 min-w-[200px]">
            <div className="grid grid-cols-2 gap-1">
              {allSources.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSourceChange(index);
                    setShowSources(false);
                  }}
                  className={`px-2 py-1 rounded text-xs ${sourceIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-700/80 text-gray-200 hover:bg-gray-600'} transition-colors`}
                >
                  Source {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {sourceIndex > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            Using backup source {sourceIndex + 1}
          </div>
        )}
      </div>
    </div>
  );
}
