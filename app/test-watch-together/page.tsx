'use client';

import React from 'react';
import WatchTogether from '../components/movie/WatchTogether';
import SyncedVideoPlayer from '../components/movie/SyncedVideoPlayer';
import { useWatchTogether } from '../hooks/useWatchTogether';

export default function TestWatchTogether() {
  const watchTogether = useWatchTogether({
    contentId: 'test-movie-123',
    contentType: 'movie',
    userName: 'TestUser'
  });

  const {
    isConnected,
    isInRoom,
    isHost,
    room,
    users,
    messages,
    syncState,
    playVideo,
    pauseVideo,
    seekVideo,
    registerVideoCallbacks
  } = watchTogether;

  // Register video callbacks
  React.useEffect(() => {
    registerVideoCallbacks({
      onPlay: (time) => {
        console.log('Video play callback triggered:', time);
        playVideo(time);
      },
      onPause: (time) => {
        console.log('Video pause callback triggered:', time);
        pauseVideo(time);
      },
      onSeek: (time) => {
        console.log('Video seek callback triggered:', time);
        seekVideo(time);
      }
    });
  }, [registerVideoCallbacks, playVideo, pauseVideo, seekVideo]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Watch Together Test Page</h1>
        
        {/* Connection Status */}
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className={`p-2 rounded ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
              Connected: {isConnected ? 'Yes' : 'No'}
            </div>
            <div className={`p-2 rounded ${isInRoom ? 'bg-green-600' : 'bg-gray-600'}`}>
              In Room: {isInRoom ? 'Yes' : 'No'}
            </div>
            <div className={`p-2 rounded ${isHost ? 'bg-yellow-600' : 'bg-gray-600'}`}>
              Host: {isHost ? 'Yes' : 'No'}
            </div>
            <div className="p-2 rounded bg-blue-600">
              Users: {users.length}
            </div>
          </div>
          {room && (
            <div className="mt-2 text-sm text-gray-300">
              Room ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{room.id}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Video Player</h2>
              {isInRoom ? (
                <SyncedVideoPlayer
                  embedUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  fallbackUrls={[
                    "https://www.youtube.com/embed/jNQXAC9IVRw",
                    "https://www.youtube.com/embed/y6120QOlsfU"
                  ]}
                  isHost={isHost}
                  syncState={syncState}
                  onPlay={(time) => {
                    console.log('SyncedVideoPlayer onPlay:', time);
                    playVideo(time);
                  }}
                  onPause={(time) => {
                    console.log('SyncedVideoPlayer onPause:', time);
                    pauseVideo(time);
                  }}
                  onSeek={(time) => {
                    console.log('SyncedVideoPlayer onSeek:', time);
                    seekVideo(time);
                  }}
                />
              ) : (
                <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Join a room to start watching together</p>
                </div>
              )}
            </div>
          </div>

          {/* Watch Together Panel */}
          <div>
            <WatchTogether
              contentId="test-movie-123"
              contentType="movie"
              contentTitle="Test Movie"
              onVideoCallbacks={{
                onPlay: (time) => {
                  console.log('WatchTogether onPlay callback:', time);
                  playVideo(time);
                },
                onPause: (time) => {
                  console.log('WatchTogether onPause callback:', time);
                  pauseVideo(time);
                },
                onSeek: (time) => {
                  console.log('WatchTogether onSeek callback:', time);
                  seekVideo(time);
                }
              }}
            />
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Users in Room:</h3>
              <div className="space-y-1">
                {users.map(user => (
                  <div key={user.id} className="text-sm bg-gray-700 p-2 rounded">
                    {user.name} {user.isHost && '(Host)'}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recent Messages:</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {messages.slice(-5).map(message => (
                  <div key={message.id} className="text-sm bg-gray-700 p-2 rounded">
                    <strong>{message.userName}:</strong> {message.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {syncState && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Sync State:</h3>
              <div className="text-sm bg-gray-700 p-2 rounded">
                Time: {syncState.currentTime.toFixed(2)}s | Playing: {syncState.isPlaying ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-900/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to Test</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open this page in two different browser tabs or windows</li>
            <li>In the first tab, create a room and note the room code</li>
            <li>In the second tab, join the room using the code</li>
            <li>Test chat by sending messages in either tab</li>
            <li>Test video sync by using the play/pause/seek buttons (host only)</li>
            <li>Check the browser console for debug logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}