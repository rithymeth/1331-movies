'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';

interface AnimeDetails {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
  episodes?: number;
  status?: string;
  score?: number;
  scored_by?: number;
  genres?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
  external?: Array<{ name: string; url: string }>;
  streaming?: Array<{ name: string; url: string }>;
}

interface AnimeClientProps {
  animeId: string;
}

export default function AnimeClient({ animeId }: AnimeClientProps) {
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedDub, setSelectedDub] = useState<'sub' | 'dub'>('sub');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/anime/${animeId}`);
        const data = await response.json();
        
        if (response.ok) {
          setAnime(data);
        } else {
          setError(data.error || 'Failed to load anime details');
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  useEffect(() => {
    if (!anime) return;

    const animeTitle = anime.title_english || anime.title;
    const cleanTitle = animeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    const streamingUrls = [
      `https://vidsrc.to/embed/anime/${anime.mal_id}/${selectedEpisode}`,
      `https://2anime.xyz/embed/${cleanTitle}-episode-${selectedEpisode}`,
      `https://aniwatch.to/watch/${cleanTitle}-${anime.mal_id}?ep=${selectedEpisode}`,
      `https://gogoanime.lu/${cleanTitle}-episode-${selectedEpisode}`
    ];

    setEmbedUrl(streamingUrls[0]);
    setFallbackUrls(streamingUrls.slice(1));
    setCurrentSourceIndex(0);
    setVideoError(null);
  }, [anime, selectedEpisode, selectedDub]);

  const switchSource = (index: number) => {
    const allUrls = [embedUrl, ...fallbackUrls].filter(Boolean) as string[];
    if (index < allUrls.length) {
      setEmbedUrl(allUrls[index]);
      setCurrentSourceIndex(index);
      setVideoError(null);
    }
  };

  const retryCurrentSource = () => {
    setVideoError(null);
    // Force re-render of video player
    const currentUrl = embedUrl;
    setEmbedUrl(null);
    setTimeout(() => setEmbedUrl(currentUrl), 100);
  };

  const navigateEpisode = (direction: 'next' | 'prev') => {
    if (!anime?.episodes) return;
    
    if (direction === 'next' && selectedEpisode < anime.episodes) {
      setSelectedEpisode(selectedEpisode + 1);
    } else if (direction === 'prev' && selectedEpisode > 1) {
      setSelectedEpisode(selectedEpisode - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400">{error || 'Anime not found'}</div>
      </div>
    );
  }

  const animeTitle = anime.title_english || anime.title;
  const allUrls = [embedUrl, ...fallbackUrls].filter(Boolean) as string[];

  return (
    <div className="min-h-screen animated-bg">
      {/* Hero Section */}
      {anime.images?.jpg?.large_image_url && (
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={animeTitle}
            fill
            className="object-cover scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/40" />
        </div>
      )}

      <div className="max-w-7xl mx-auto -mt-40 relative z-10 px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Anime Poster */}
          <div className="relative group">
            <div className="aspect-[2/3] relative rounded-2xl overflow-hidden glass-dark border border-white/10 shadow-2xl">
              {anime.images?.jpg?.large_image_url ? (
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={animeTitle}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Anime Details */}
          <div className="space-y-8">
            {/* Title and Meta */}
            <div className="space-y-4">
              <h1 className="text-5xl font-black gradient-text leading-tight">
                {animeTitle}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                {anime.episodes && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{anime.episodes} Episodes</span>
                  </div>
                )}
                {anime.status && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{anime.status}</span>
                  </div>
                )}
                {anime.score && (
                  <div className="flex items-center gap-2 glass-dark px-3 py-1 rounded-full border border-white/10">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-white">{anime.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {anime.genres.map((genre) => (
                    <span key={genre.mal_id} className="px-4 py-2 glass-dark rounded-xl text-sm font-medium border border-white/10">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {anime.synopsis}
                </p>
              </div>
            )}

            {/* Episode Selection and Controls */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">Watch Episodes</h2>
              </div>
              
              {/* Episode and Language Selection */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-white font-medium">Episode:</label>
                  <input
                    type="number"
                    min="1"
                    max={anime.episodes || 1}
                    value={selectedEpisode}
                    onChange={(e) => setSelectedEpisode(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 glass-dark rounded-lg border border-white/10 text-white bg-transparent"
                  />
                  <span className="text-gray-400">of {anime.episodes || 1}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDub('sub')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedDub === 'sub'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'glass-dark border border-white/10 text-gray-300 hover:border-purple-500/30'
                    }`}
                  >
                    SUB
                  </button>
                  <button
                    onClick={() => setSelectedDub('dub')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedDub === 'dub'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'glass-dark border border-white/10 text-gray-300 hover:border-purple-500/30'
                    }`}
                  >
                    DUB
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="space-y-4">
                {embedUrl ? (
                  <div className="relative group">
                    <div className="aspect-video glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <VideoPlayer
                        embedUrl={embedUrl}
                        fallbackUrls={fallbackUrls}
                      />
                    </div>
                    
                    {/* Source Selection Buttons */}
                    {allUrls.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-white font-medium">Sources:</span>
                        {allUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => switchSource(index)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                              currentSourceIndex === index
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'glass-dark border border-white/10 text-gray-300 hover:border-purple-500/30'
                            }`}
                          >
                            Source {index + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video glass-dark rounded-2xl flex items-center justify-center">
                    <div className="text-white">Loading video...</div>
                  </div>
                )}

                {/* Error Message and Controls */}
                {videoError && (
                  <div className="glass-dark rounded-xl p-4 border border-red-500/30">
                    <div className="text-red-400 text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Video Source Error</h3>
                      <p className="text-gray-300">{videoError}</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={retryCurrentSource}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                      >
                        Retry
                      </button>
                      {currentSourceIndex < allUrls.length - 1 && (
                        <button
                          onClick={() => switchSource(currentSourceIndex + 1)}
                          className="px-4 py-2 glass-dark border border-white/10 text-white rounded-lg hover:border-purple-500/30 transition-all duration-300"
                        >
                          Try Next Source
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => navigateEpisode('prev')}
                    disabled={selectedEpisode <= 1}
                    className="flex items-center gap-2 px-6 py-3 glass-dark rounded-xl border border-white/10 text-white hover:border-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Episode
                  </button>
                  
                  <button
                    onClick={() => navigateEpisode('next')}
                    disabled={!anime.episodes || selectedEpisode >= anime.episodes}
                    className="flex items-center gap-2 px-6 py-3 glass-dark rounded-xl border border-white/10 text-white hover:border-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Episode
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Official Streaming Links */}
            {anime.streaming && anime.streaming.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Official Streaming</h3>
                <div className="flex flex-wrap gap-3">
                  {anime.streaming.map((stream, index) => (
                    <a
                      key={index}
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass-dark rounded-xl border border-white/10 text-blue-400 hover:border-blue-500/30 transition-all duration-300"
                    >
                      {stream.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {anime.external && anime.external.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">External Links</h3>
                <div className="flex flex-wrap gap-3">
                  {anime.external.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass-dark rounded-xl border border-white/10 text-gray-300 hover:border-purple-500/30 transition-all duration-300"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Structured Data */}
      {anime && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TVSeries",
              "name": animeTitle,
              "description": anime.synopsis || `Watch ${animeTitle} anime online`,
              "image": anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
              "genre": anime.genres?.map(g => g.name) || [],
              "numberOfEpisodes": anime.episodes,
              "aggregateRating": anime.score ? {
                "@type": "AggregateRating",
                "ratingValue": anime.score,
                "ratingCount": anime.scored_by || 1,
                "bestRating": 10,
                "worstRating": 1
              } : undefined,
              "productionCompany": anime.studios?.map(studio => ({
                "@type": "Organization",
                "name": studio.name
              })) || [],
              "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.netlify.app'}/anime/${anime.mal_id}`,
              "sameAs": [
                `https://myanimelist.net/anime/${anime.mal_id}`,
                ...(anime.external?.filter(ext => ext.url) || []).map(ext => ext.url)
              ].filter(Boolean)
            })
          }}
        />
      )}
    </div>
  );
}