'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';
import WatchlistButton from '../../components/movie/WatchlistButton';
import { getVidkingEpisodeUrl } from '@/app/lib/vidking';

interface TVShowDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  seasons: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    overview: string;
    poster_path: string;
    episodes: Array<{
      id: number;
      name: string;
      episode_number: number;
      overview: string;
      still_path: string;
      air_date: string;
    }>;
  }>;
}

interface Props {
  tvShowId: string;
  initialData?: TVShowDetails;
}

export default function TVShowClient({ tvShowId, initialData }: Props) {
  const [tvShow, setTVShow] = useState<TVShowDetails | null>(initialData || null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateEpisode = useCallback((direction: 'next' | 'prev') => {
    if (!tvShow) {
      return;
    }

    // Sort seasons by season_number
    const sortedSeasons = [...tvShow.seasons].sort((a, b) => a.season_number - b.season_number);
    const currentSeasonIndex = sortedSeasons.findIndex(s => s.season_number === selectedSeason);
    
    if (currentSeasonIndex === -1) {
      return;
    }

    const currentSeason = sortedSeasons[currentSeasonIndex];
    if (!currentSeason?.episodes) {
      return;
    }

    // Sort episodes by episode_number
    const sortedEpisodes = [...currentSeason.episodes].sort((a, b) => a.episode_number - b.episode_number);
    const currentEpisodeIndex = sortedEpisodes.findIndex(e => e.episode_number === selectedEpisode);
    
    if (direction === 'next') {
      if (currentEpisodeIndex < sortedEpisodes.length - 1) {
        // Next episode in current season
        const nextEpisode = sortedEpisodes[currentEpisodeIndex + 1];
        setSelectedEpisode(nextEpisode.episode_number);
      } else if (currentSeasonIndex < sortedSeasons.length - 1) {
        // First episode of next season
        const nextSeason = sortedSeasons[currentSeasonIndex + 1];
        setSelectedSeason(nextSeason.season_number);
        if (nextSeason.episodes && nextSeason.episodes.length > 0) {
          const firstEpisode = [...nextSeason.episodes].sort((a, b) => a.episode_number - b.episode_number)[0];
          setSelectedEpisode(firstEpisode.episode_number);
        }
      }
    } else {
      if (currentEpisodeIndex > 0) {
        // Previous episode in current season
        const prevEpisode = sortedEpisodes[currentEpisodeIndex - 1];
        setSelectedEpisode(prevEpisode.episode_number);
      } else if (currentSeasonIndex > 0) {
        // Last episode of previous season
        const prevSeason = sortedSeasons[currentSeasonIndex - 1];
        setSelectedSeason(prevSeason.season_number);
        if (prevSeason.episodes && prevSeason.episodes.length > 0) {
          const lastEpisode = [...prevSeason.episodes].sort((a, b) => b.episode_number - a.episode_number)[0];
          setSelectedEpisode(lastEpisode.episode_number);
        }
      }
    }
  }, [tvShow, selectedSeason, selectedEpisode]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        navigateEpisode('next');
      } else if (e.key === 'ArrowLeft') {
        navigateEpisode('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateEpisode]);

  useEffect(() => {
    if (!initialData) {
      const fetchTVShowDetails = async () => {
        try {
          const response = await fetch(`/api/tv/${tvShowId}`);
          const data = await response.json();
          
          if (response.ok) {
            setTVShow(data);
            // Set initial season and episode
            if (data.seasons && data.seasons.length > 0) {
              const firstSeason = data.seasons.find((s: TVShowDetails['seasons'][0]) => s.season_number === 1) || data.seasons[0];
              setSelectedSeason(firstSeason.season_number);
              setSelectedEpisode(1);
            }
          } else {
            console.error('Error response:', data);
            setError(data.error || 'Failed to load TV show details');
          }
        } catch (error) {
          console.error('Error fetching TV show details:', error);
          setError('Failed to load TV show details. Please try again later.');
        }
      };

      fetchTVShowDetails();
    } else {
      // Set initial season and episode for server-side data
      if (initialData.seasons && initialData.seasons.length > 0) {
        const firstSeason = initialData.seasons.find((s: TVShowDetails['seasons'][0]) => s.season_number === 1) || initialData.seasons[0];
        setSelectedSeason(firstSeason.season_number);
        setSelectedEpisode(1);
      }
    }
  }, [tvShowId, initialData]);

  // Load episode when season or episode changes
  useEffect(() => {
    if (!tvShow || !selectedSeason || !selectedEpisode) {
      return;
    }

    const season = tvShow.seasons.find(s => s.season_number === selectedSeason);
    if (!season?.episodes) {
      console.error('Season or episodes not found:', selectedSeason);
      setError('Season not found');
      return;
    }

    const episode = season.episodes.find(e => e.episode_number === selectedEpisode);
    if (!episode) {
      console.error('Episode not found:', { selectedSeason, selectedEpisode });
      setError('Episode not found');
      return;
    }

    // Reset video player state
    setEmbedUrl(null);
    setError(null);
    setIsLoading(true);

    // Construct streaming URLs
    setEmbedUrl(getVidkingEpisodeUrl(tvShow.id, selectedSeason, selectedEpisode));
    setIsLoading(false);
  }, [selectedSeason, selectedEpisode, tvShow]);

  const retryLoading = () => {
    if (tvShow && selectedSeason && selectedEpisode) {
      // Re-initialize the URLs
      setEmbedUrl(getVidkingEpisodeUrl(tvShow.id, selectedSeason, selectedEpisode));
      setError(null);
    }
  };

  if (!tvShow) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentSeason = tvShow.seasons.find(s => s.season_number === selectedSeason);
  const currentEpisode = currentSeason?.episodes?.find(e => e.episode_number === selectedEpisode);

  return (
    <div className="min-h-screen bg-[#080b10]">
      {/* Hero Section */}
      {tvShow.backdrop_path && (
        <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
            alt={tvShow.name}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-[#080b10]/20" />
        </div>
      )}

      <div className="max-w-6xl mx-auto -mt-20 relative z-10 px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* TV Show Poster */}
          <div className="relative group">
            <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-[#121923] border border-white/10 shadow-2xl">
              {tvShow.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                  alt={tvShow.name}
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

          {/* TV Show Details */}
          <div className="space-y-7">
            {/* Title and Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  {tvShow.name}
                </h1>
                <WatchlistButton item={{ id: tvShow.id, type: 'tv', title: tvShow.name, posterPath: tvShow.poster_path }} />
              </div>
              
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tvShow.number_of_seasons} Seasons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tvShow.number_of_episodes} Episodes</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-white">{tvShow.vote_average.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <span key={genre.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            {tvShow.overview && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Overview</h2>
                <p className="max-w-3xl text-gray-300 leading-relaxed">
                  {tvShow.overview}
                </p>
              </div>
            )}

            {/* Season and Episode Selection */}
            <div className="space-y-5 rounded-xl border border-white/10 bg-[#0d131c] p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">Watch episodes</h2>
              </div>
              
              {/* Season Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Season</h3>
                <div className="flex flex-wrap gap-3">
                  {tvShow.seasons
                    .filter(season => season.season_number > 0)
                    .sort((a, b) => a.season_number - b.season_number)
                    .map((season) => (
                    <button
                      key={season.id}
                      onClick={() => {
                        setSelectedSeason(season.season_number);
                        setSelectedEpisode(1);
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        selectedSeason === season.season_number
                          ? 'bg-cyan-300 text-slate-950'
                          : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Season {season.season_number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode Selector */}
              {currentSeason?.episodes && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Episode</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {currentSeason.episodes
                      .sort((a, b) => a.episode_number - b.episode_number)
                      .map((episode) => (
                      <button
                        key={episode.id}
                        onClick={() => setSelectedEpisode(episode.episode_number)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedEpisode === episode.episode_number
                            ? 'bg-cyan-300 text-slate-950'
                            : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                        title={episode.name}
                      >
                        {episode.episode_number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Player */}
              <div className="space-y-4">
                {currentEpisode && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      S{selectedSeason}E{selectedEpisode}: {currentEpisode.name}
                    </h3>
                    {currentEpisode.overview && (
                      <p className="text-gray-300">{currentEpisode.overview}</p>
                    )}
                  </div>
                )}
                
                {isLoading ? (
                  <div className="aspect-video rounded-lg border border-white/10 bg-[#101722] flex items-center justify-center">
                    <div className="text-white">Loading episode...</div>
                  </div>
                ) : error ? (
                  <div className="aspect-video rounded-lg border border-white/10 bg-[#101722] flex flex-col items-center justify-center space-y-4">
                    <div className="text-red-400 text-center">
                      <h3 className="text-xl font-semibold mb-2">Unable to load video sources</h3>
                      <p className="text-gray-300">Try a different episode or check back later.</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={retryLoading}
                        className="rounded-md bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : embedUrl ? (
                  <div className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-xl">
                      <VideoPlayer
                        embedUrl={embedUrl}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => navigateEpisode('prev')}
                    className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Episode
                  </button>
                  
                  <button
                    onClick={() => navigateEpisode('next')}
                    className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10"
                  >
                    Next Episode
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}