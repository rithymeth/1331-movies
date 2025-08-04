'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SyncedVideoPlayerProps {
  embedUrl: string;
  fallbackUrls?: string[];
  isHost?: boolean;
  syncState?: { currentTime: number; isPlaying: boolean };
  onPlay?: (currentTime: number) => void;
  onPause?: (currentTime: number) => void;
  onSeek?: (currentTime: number) => void;
}

export default function SyncedVideoPlayer({ 
  embedUrl, 
  fallbackUrls = [],
  isHost = true,
  syncState,
  onPlay,
  onPause,
  onSeek
}: SyncedVideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(embedUrl);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const allSources = [embedUrl, ...fallbackUrls];
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

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

  // Handle sync state changes from other users
  useEffect(() => {
    if (!isHost && syncState && !isInternalUpdate) {
      const timeDiff = Math.abs(syncState.currentTime - lastSyncTime);
      
      // Only sync if there's a significant time difference (more than 2 seconds)
      if (timeDiff > 2) {
        setLastSyncTime(syncState.currentTime);
        
        // Clear any existing timeout
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        
        // Simulate video player sync (in a real implementation, you'd interact with the actual video element)
        syncTimeoutRef.current = setTimeout(() => {
          console.log(`Syncing to time: ${syncState.currentTime}, playing: ${syncState.isPlaying}`);
          // Here you would actually sync the video player
          // For iframe-based players, this is limited, but you could:
          // 1. Reload the iframe with a timestamp parameter
          // 2. Use postMessage to communicate with the iframe if it supports it
          // 3. Show a sync notification to the user
        }, 100);
      }
    }
  }, [syncState, isHost, lastSyncTime, isInternalUpdate]);

  // Video control functions for host
  const handleVideoPlay = useCallback(() => {
    if (isHost && onPlay) {
      setIsInternalUpdate(true);
      const currentTime = Date.now() / 1000; // Simulate current time
      onPlay(currentTime);
      console.log('Host triggered play event');
      setTimeout(() => setIsInternalUpdate(false), 100);
    }
  }, [isHost, onPlay]);

  const handleVideoPause = useCallback(() => {
    if (isHost && onPause) {
      setIsInternalUpdate(true);
      const currentTime = Date.now() / 1000; // Simulate current time
      onPause(currentTime);
      console.log('Host triggered pause event');
      setTimeout(() => setIsInternalUpdate(false), 100);
    }
  }, [isHost, onPause]);

  const handleVideoSeek = useCallback((seekTime: number) => {
    if (isHost && onSeek) {
      setIsInternalUpdate(true);
      onSeek(seekTime);
      console.log('Host triggered seek event to:', seekTime);
      setTimeout(() => setIsInternalUpdate(false), 100);
    }
  }, [isHost, onSeek]);

  // Auto-sync functionality for iframe videos
  const triggerAutoSync = useCallback(() => {
    if (isHost && onPlay) {
      const currentTime = Date.now() / 1000;
      onPlay(currentTime);
      console.log('Auto-sync triggered');
    }
  }, [isHost, onPlay]);

  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;
    let loadTimeout: NodeJS.Timeout;

    setIsLoading(true);

    // Set a timeout to automatically try next source if current one doesn't load
    errorTimeout = setTimeout(() => {
      if (autoSwitch && sourceIndex < allSources.length - 1) {
        console.log(`Source ${sourceIndex + 1} took too long to load, trying next source...`);
        tryNextSource();
      } else {
        setIsLoading(false);
      }
    }, 8000);

    // Set loading to false after a reasonable time
    loadTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(errorTimeout);
      clearTimeout(loadTimeout);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [currentUrl, tryNextSource, autoSwitch, sourceIndex, allSources.length]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.log(`Source ${sourceIndex + 1} failed to load`);
    setIsLoading(false);
    if (autoSwitch) {
      tryNextSource();
    }
  };

  return (
    <div className="w-full aspect-video relative bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Sync indicator for non-hosts */}
      {!isHost && syncState && (
        <div className="absolute top-16 left-3 bg-blue-600/90 text-white px-2 py-1 rounded text-xs z-20">
          🔄 Synced with host
        </div>
      )}
      
      {/* Host indicator */}
      {isHost && (
        <div className="absolute top-16 left-3 bg-yellow-600/90 text-white px-2 py-1 rounded text-xs z-20">
          👑 You control playback
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
        <div className="flex items-center justify-between">
          {/* Watch together status */}
          <div className="flex items-center gap-2">
            {!isHost && (
              <div className="text-xs text-blue-300">
                Watching with others
              </div>
            )}
            {isHost && (
              <div className="text-xs text-yellow-300">
                Others will follow your playback
              </div>
            )}
          </div>
          
          {/* Source controls */}
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
                  className={`px-2 py-1 rounded text-xs ${
                    sourceIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700/80 text-gray-200 hover:bg-gray-600'
                  } transition-colors`}
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
      
      {/* Video sync controls for host */}
      {isHost && (
        <div className="absolute bottom-3 left-3 flex gap-2 z-20">
          <button
            onClick={handleVideoPlay}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1"
            title="Sync Play for Everyone"
          >
            ▶ Play
          </button>
          <button
            onClick={handleVideoPause}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1"
            title="Sync Pause for Everyone"
          >
            ⏸ Pause
          </button>
          <button
            onClick={() => handleVideoSeek(Math.random() * 3600)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
            title="Random Seek (for testing)"
          >
            ⏭ Seek
          </button>
          <button
            onClick={triggerAutoSync}
            className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center gap-1"
            title="Trigger Auto-Sync"
          >
            🔄 Sync
          </button>
        </div>
      )}
      
      {/* Instructions for host */}
      {isHost && (
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs p-2 rounded max-w-xs z-20">
          💡 Use the sync buttons to control playback for everyone. Since this is an iframe video, manual sync controls are provided.
        </div>
      )}
    </div>
  );
}