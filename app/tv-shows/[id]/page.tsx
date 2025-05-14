'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/VideoPlayer';
import AdcashAd from '../../components/AdcashAd';

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
  params: {
    id: string;
  };
}

export default function TVShowPage({ params }: Props) {
  const [tvShow, setTVShow] = useState<TVShowDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateEpisode = useCallback((direction: 'next' | 'prev') => {
    console.log('Navigating:', direction);
    if (!tvShow) {
      console.log('No TV show data');
      return;
    }

    // Sort seasons by season_number
    const sortedSeasons = [...tvShow.seasons].sort((a, b) => a.season_number - b.season_number);
    const currentSeasonIndex = sortedSeasons.findIndex(s => s.season_number === selectedSeason);
    
    if (currentSeasonIndex === -1) {
      console.log('Current season not found');
      return;
    }

    const currentSeason = sortedSeasons[currentSeasonIndex];
    if (!currentSeason?.episodes) {
      console.log('No episodes in current season');
      return;
    }

    // Sort episodes by episode_number
    const sortedEpisodes = [...currentSeason.episodes].sort((a, b) => a.episode_number - b.episode_number);
    const currentEpisodeIndex = sortedEpisodes.findIndex(e => e.episode_number === selectedEpisode);
    
    console.log('Current position:', {
      seasonIndex: currentSeasonIndex,
      episodeIndex: currentEpisodeIndex,
      totalSeasons: sortedSeasons.length,
      totalEpisodes: sortedEpisodes.length
    });

    if (direction === 'next') {
      if (currentEpisodeIndex < sortedEpisodes.length - 1) {
        // Next episode in current season
        const nextEpisode = sortedEpisodes[currentEpisodeIndex + 1];
        console.log('Moving to next episode:', nextEpisode.episode_number);
        setSelectedEpisode(nextEpisode.episode_number);
      } else if (currentSeasonIndex < sortedSeasons.length - 1) {
        // First episode of next season
        const nextSeason = sortedSeasons[currentSeasonIndex + 1];
        console.log('Moving to next season:', nextSeason.season_number);
        setSelectedSeason(nextSeason.season_number);
        if (nextSeason.episodes && nextSeason.episodes.length > 0) {
          const firstEpisode = [...nextSeason.episodes].sort((a, b) => a.episode_number - b.episode_number)[0];
          setSelectedEpisode(firstEpisode.episode_number);
        }
      } else {
        console.log('Already at last episode of last season');
      }
    } else {
      if (currentEpisodeIndex > 0) {
        // Previous episode in current season
        const prevEpisode = sortedEpisodes[currentEpisodeIndex - 1];
        console.log('Moving to previous episode:', prevEpisode.episode_number);
        setSelectedEpisode(prevEpisode.episode_number);
      } else if (currentSeasonIndex > 0) {
        // Last episode of previous season
        const prevSeason = sortedSeasons[currentSeasonIndex - 1];
        console.log('Moving to previous season:', prevSeason.season_number);
        setSelectedSeason(prevSeason.season_number);
        if (prevSeason.episodes && prevSeason.episodes.length > 0) {
          const lastEpisode = [...prevSeason.episodes].sort((a, b) => b.episode_number - a.episode_number)[0];
          setSelectedEpisode(lastEpisode.episode_number);
        }
      } else {
        console.log('Already at first episode of first season');
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
    const fetchTVShowDetails = async () => {
      try {
        console.log('Fetching TV show details...');
        const response = await fetch(`/api/tv/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          console.log('TV show details fetched successfully');
          setTVShow(data);
          // Set initial season and episode
          if (data.seasons && data.seasons.length > 0) {
            const firstSeason = data.seasons.find(s => s.season_number === 1) || data.seasons[0];
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
  }, [params.id]);

  // Load episode when season or episode changes
  // Load episode when selection changes
  useEffect(() => {
    if (!tvShow || !selectedSeason || !selectedEpisode) {
      console.log('Missing required data');
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

    console.log('Loading episode:', { 
      season: selectedSeason, 
      episode: selectedEpisode,
      episodeTitle: episode.name
    });

    // Reset video player state
    setEmbedUrl(null);
    setError(null);
    setIsLoading(true);

    // Construct new embed URL
    const newEmbedUrl = `https://vidsrc.cc/v2/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&poster=true`;
    console.log('New embed URL:', newEmbedUrl);

    // Short delay to ensure video player resets
    setTimeout(() => {
      setEmbedUrl(newEmbedUrl);
      setIsLoading(false);
    }, 100);

  }, [selectedSeason, selectedEpisode, tvShow]);

  // Reset episode when season changes
  useEffect(() => {
    if (tvShow) {
      const season = tvShow.seasons.find(s => s.season_number === selectedSeason);
      if (season && season.episodes && season.episodes.length > 0) {
        console.log('Setting first episode for season:', selectedSeason);
        setSelectedEpisode(1);
      }
    }
  }, [selectedSeason, tvShow]);

  if (!tvShow) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {tvShow.backdrop_path && (
        <div className="relative h-[400px] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
            alt={tvShow.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Dropdown Ad */}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {tvShow.name}
            </h1>
            {tvShow.original_name !== tvShow.name && (
              <h2 className="text-xl text-gray-400 mb-4">{tvShow.original_name}</h2>
            )}

            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue-400">{tvShow.status}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400">{tvShow.number_of_seasons} Seasons</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400">{tvShow.number_of_episodes} Episodes</span>
              {tvShow.vote_average > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">★ {tvShow.vote_average.toFixed(1)}</span>
                </>
              )}
            </div>

            <div className="text-gray-300 mb-6">{tvShow.overview}</div>

            <div className="mb-6">
              <div className="text-white font-semibold mb-2">Genres</div>
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex justify-center items-center h-[400px] bg-gray-800 rounded-lg">
            <div className="text-white">Loading...</div>
          </div>
        ) : error ? (
          <div className="mt-8 flex justify-center items-center h-[400px] bg-gray-800 rounded-lg">
            <div className="text-red-500">{error}</div>
          </div>
        ) : embedUrl ? (
          <div className="mt-8 space-y-4">
            {/* Ad before video */}
            <div className="mb-4">
              <AdcashAd zoneId="lxlvor92mg" />
            </div>
            <VideoPlayer embedUrl={embedUrl} fallbackUrls={fallbackUrls} />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigateEpisode('prev')}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Episode
              </button>
              <button
                onClick={() => navigateEpisode('next')}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                Next Episode
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <div className="text-white font-semibold mb-4">Seasons</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tvShow.seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`p-4 rounded-lg transition-all ${
                  selectedSeason === season.season_number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{season.name}</div>
                <div className="text-sm opacity-75">{season.episode_count} Episodes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ad between video and episodes */}
        <div className="mt-8">
          <AdcashAd zoneId="lxlvor92mg" />
        </div>

        <div className="mt-8">
          <div className="text-white font-semibold mb-4">Episodes</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tvShow.seasons
              .find(s => s.season_number === selectedSeason)?.episodes?.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => {
                    console.log('Selecting episode:', episode.episode_number);
                    setSelectedEpisode(episode.episode_number);
                  }}
                  className={`p-4 rounded-lg transition-all ${
                    selectedEpisode === episode.episode_number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">Episode {episode.episode_number}</div>
                  <div className="text-sm opacity-75 truncate">{episode.name}</div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
