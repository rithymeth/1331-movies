'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';
import SyncedVideoPlayer from '../../components/movie/SyncedVideoPlayer';
import WatchTogether from '../../components/movie/WatchTogether';
import { UserGroupIcon } from '@heroicons/react/24/outline';

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

interface MovieClientProps {
  movie: MovieDetails;
  cast: CastMember[];
  videos: Video[];
}

export function MovieClient({ movie, cast, videos }: MovieClientProps) {
  const [showWatchTogether, setShowWatchTogether] = useState(false);
  const [watchTogetherMode, setWatchTogetherMode] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [syncState, setSyncState] = useState({ currentTime: 0, isPlaying: false });

  // Video callback handlers for watch together
  const handleVideoPlay = useCallback((currentTime: number) => {
    console.log('Video played at:', currentTime);
    setSyncState(prev => ({ ...prev, isPlaying: true, currentTime }));
  }, []);

  const handleVideoPause = useCallback((currentTime: number) => {
    console.log('Video paused at:', currentTime);
    setSyncState(prev => ({ ...prev, isPlaying: false, currentTime }));
  }, []);

  const handleVideoSeek = useCallback((currentTime: number) => {
    console.log('Video seeked to:', currentTime);
    setSyncState(prev => ({ ...prev, currentTime }));
  }, []);

  const videoCallbacks = {
    onPlay: handleVideoPlay,
    onPause: handleVideoPause,
    onSeek: handleVideoSeek
  };

  if (!movie.imdb_id) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">Movie Not Available</h1>
        <p className="text-gray-400 mt-2">
          Sorry, this movie is not available for streaming.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover scale-110 transition-transform duration-700"
            />
            {/* Multi-layer gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-slate-900" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        )}
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto -mt-40 relative z-10 px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Movie Poster */}
          <div className="relative group">
            <div className="aspect-[2/3] relative rounded-2xl overflow-hidden glass-dark border border-white/10 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="space-y-8">
            {/* Title and Meta */}
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-5xl font-black gradient-text leading-tight">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{new Date(movie.release_date).getFullYear()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
                
                <div className="flex items-center gap-2 glass-dark px-3 py-1 rounded-full border border-white/10">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({movie.vote_count.toLocaleString()})</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-4 py-2 glass-dark rounded-xl text-sm font-medium border border-white/10 hover:border-purple-500/30 transition-colors duration-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            {movie.overview && (
              <div className="space-y-3 animate-fade-in-up delay-200">
                <h2 className="text-2xl font-bold text-white">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Watch Movie Section */}
            <div className="space-y-6 animate-fade-in-up delay-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Watch Movie</h2>
                </div>
                
                {/* Watch Together Toggle */}
                <button
                  onClick={() => setShowWatchTogether(!showWatchTogether)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    showWatchTogether 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                  }`}
                >
                  <UserGroupIcon className="w-5 h-5" />
                  <span className="font-medium">Watch Together</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
                {/* Video Player */}
                <div className="relative group">
                  <div className="aspect-video glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                    
                    {watchTogetherMode ? (
                      <SyncedVideoPlayer
                        embedUrl={`https://vidsrc.cc/v2/embed/movie/${movie.imdb_id}`}
                        fallbackUrls={[
                          `https://vidsrc.to/embed/movie/${movie.imdb_id}`,
                          `https://2embed.org/embed/${movie.imdb_id}`,
                          `https://streamtape.com/e/${movie.imdb_id}`,
                          `https://rapid-cloud.co/embed-6/movie?id=${movie.imdb_id}`
                        ]}
                        isHost={isHost}
                        syncState={syncState}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onSeek={handleVideoSeek}
                      />
                    ) : (
                      <VideoPlayer
                        embedUrl={`https://vidsrc.cc/v2/embed/movie/${movie.imdb_id}`}
                        fallbackUrls={[
                          `https://vidsrc.to/embed/movie/${movie.imdb_id}`,
                          `https://2embed.org/embed/${movie.imdb_id}`,
                          `https://streamtape.com/e/${movie.imdb_id}`,
                          `https://rapid-cloud.co/embed-6/movie?id=${movie.imdb_id}`
                        ]}
                      />
                    )}
                  </div>
                </div>
                
                {/* Watch Together Panel */}
                {showWatchTogether && (
                  <div className="animate-fade-in-up">
                    <WatchTogether
                      contentId={movie.id.toString()}
                      contentType="movie"
                      contentTitle={movie.title}
                      onVideoCallbacks={videoCallbacks}
                    />
                  </div>
                )}
              </div>

              {/* Trailers Section */}
              {videos.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Trailers & Clips</h2>
                  </div>
                  
                  <div className="grid gap-6">
                    {videos.map((video, index) => (
                      <div key={video.id} className="space-y-3 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
                          {video.name}
                        </h3>
                        <div className="relative group">
                          <div className="aspect-video glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:shadow-red-500/25 transition-all duration-500">
                            <VideoPlayer
                              embedUrl={`https://www.youtube.com/embed/${video.key}?autoplay=0&controls=1&modestbranding=1`}
                              fallbackUrls={[]}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cast Section */}
            <div className="space-y-6 animate-fade-in-up delay-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Cast</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {cast.map((member, index) => (
                  <div key={member.id} className="group text-center animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="aspect-[2/3] relative rounded-2xl overflow-hidden glass-dark border border-white/10 mb-3 group-hover:border-purple-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                      {member.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors duration-300">{member.name}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}