'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';
import WatchlistButton from '../../components/movie/WatchlistButton';
import { getVidkingEpisodeUrl } from '@/app/lib/vidking';
import { saveWatchHistory } from '@/app/lib/watchHistory';
import { getMediaYear, getTmdbImageUrl } from '@/app/lib/tmdb';

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  still_path: string;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  overview: string;
  poster_path: string;
  episodes: Episode[];
}

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
  genres: Array<{ id: number; name: string }>;
  seasons: Season[];
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
    if (!tvShow) return;
    const sortedSeasons = [...tvShow.seasons].filter((season) => season.season_number > 0).sort((a, b) => a.season_number - b.season_number);
    const currentSeasonIndex = sortedSeasons.findIndex((s) => s.season_number === selectedSeason);
    if (currentSeasonIndex === -1) return;
    const currentSeason = sortedSeasons[currentSeasonIndex];
    const sortedEpisodes = [...(currentSeason.episodes || [])].sort((a, b) => a.episode_number - b.episode_number);
    const currentEpisodeIndex = sortedEpisodes.findIndex((e) => e.episode_number === selectedEpisode);

    if (direction === 'next') {
      if (currentEpisodeIndex < sortedEpisodes.length - 1) {
        setSelectedEpisode(sortedEpisodes[currentEpisodeIndex + 1].episode_number);
      } else if (currentSeasonIndex < sortedSeasons.length - 1) {
        setSelectedSeason(sortedSeasons[currentSeasonIndex + 1].season_number);
        setSelectedEpisode(1);
      }
    } else if (currentEpisodeIndex > 0) {
      setSelectedEpisode(sortedEpisodes[currentEpisodeIndex - 1].episode_number);
    } else if (currentSeasonIndex > 0) {
      const prevSeason = sortedSeasons[currentSeasonIndex - 1];
      setSelectedSeason(prevSeason.season_number);
      const lastEpisode = [...(prevSeason.episodes || [])].sort((a, b) => b.episode_number - a.episode_number)[0];
      setSelectedEpisode(lastEpisode?.episode_number || 1);
    }
  }, [tvShow, selectedSeason, selectedEpisode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigateEpisode('next');
      if (e.key === 'ArrowLeft') navigateEpisode('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateEpisode]);

  useEffect(() => {
    if (initialData?.seasons?.length) {
      const firstSeason = initialData.seasons.find((s) => s.season_number === 1) || initialData.seasons.find((s) => s.season_number > 0) || initialData.seasons[0];
      setSelectedSeason(firstSeason.season_number);
      setSelectedEpisode(1);
      return;
    }

    const fetchTVShowDetails = async () => {
      try {
        const response = await fetch(`/api/tv/${tvShowId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load TV show details');
          return;
        }
        setTVShow(data);
        const firstSeason = data.seasons?.find((s: Season) => s.season_number === 1) || data.seasons?.[0];
        if (firstSeason) {
          setSelectedSeason(firstSeason.season_number);
          setSelectedEpisode(1);
        }
      } catch {
        setError('Failed to load TV show details. Please try again later.');
      }
    };

    fetchTVShowDetails();
  }, [tvShowId, initialData]);

  useEffect(() => {
    if (!tvShow) return;
    const season = tvShow.seasons.find((entry) => entry.season_number === selectedSeason);
    if (!season || (season.episodes && season.episodes.length > 0)) return;

    let cancelled = false;
    const loadSeason = async () => {
      try {
        const response = await fetch(`/api/tv/${tvShow.id}/season/${selectedSeason}`);
        const data = await response.json();
        if (cancelled || !response.ok) return;
        setTVShow((current) => {
          if (!current) return current;
          return {
            ...current,
            seasons: current.seasons.map((entry) =>
              entry.season_number === selectedSeason
                ? { ...entry, episodes: data.episodes || [] }
                : entry
            )
          };
        });
      } catch (loadError) {
        console.error('Error loading season', loadError);
      }
    };

    loadSeason();
    return () => {
      cancelled = true;
    };
  }, [selectedSeason, tvShow]);

  useEffect(() => {
    if (!tvShow || !selectedSeason || !selectedEpisode) return;
    const season = tvShow.seasons.find((s) => s.season_number === selectedSeason);
    if (!season) {
      setError('Season not found');
      return;
    }
    if (!season.episodes || season.episodes.length === 0) return;
    const episode = season.episodes.find((e) => e.episode_number === selectedEpisode);
    if (!episode) {
      setSelectedEpisode(season.episodes[0].episode_number);
      return;
    }
    setError(null);
    setIsLoading(false);
    setEmbedUrl(getVidkingEpisodeUrl(tvShow.id, selectedSeason, selectedEpisode));
  }, [selectedSeason, selectedEpisode, tvShow]);

  useEffect(() => {
    const season = tvShow?.seasons.find((entry) => entry.season_number === selectedSeason);
    const episode = season?.episodes.find((entry) => entry.episode_number === selectedEpisode);
    if (!tvShow || !episode) return;
    saveWatchHistory({
      id: tvShow.id,
      type: 'tv',
      title: tvShow.name,
      posterPath: tvShow.poster_path,
      season: selectedSeason,
      episode: selectedEpisode,
      episodeTitle: episode.name
    });
  }, [selectedEpisode, selectedSeason, tvShow]);

  if (!tvShow) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  const currentSeason = tvShow.seasons.find((s) => s.season_number === selectedSeason);
  const currentEpisode = currentSeason?.episodes?.find((e) => e.episode_number === selectedEpisode);

  return (
    <div className="min-h-screen bg-[#080b10]">
      {tvShow.backdrop_path && (
        <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden">
          <Image src={getTmdbImageUrl(tvShow.backdrop_path, 'original') || ''} alt={tvShow.name} fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-[#080b10]/20" />
        </div>
      )}
      <div className="max-w-6xl mx-auto -mt-20 relative z-10 px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-[#121923] border border-white/10 shadow-2xl">
            {tvShow.poster_path ? (
              <Image src={getTmdbImageUrl(tvShow.poster_path, 'w500') || ''} alt={tvShow.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="space-y-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{tvShow.name}</h1>
              <WatchlistButton item={{ id: tvShow.id, type: 'tv', title: tvShow.name, posterPath: tvShow.poster_path }} />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
              <span>{getMediaYear(tvShow.first_air_date)}</span>
              <span>{tvShow.number_of_seasons} Seasons</span>
              <span>{tvShow.number_of_episodes} Episodes</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-bold text-white">{tvShow.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <span key={genre.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">{genre.name}</span>
              ))}
            </div>
            {tvShow.overview ? <p className="max-w-3xl text-gray-300 leading-relaxed">{tvShow.overview}</p> : null}
            <div className="space-y-5 rounded-xl border border-white/10 bg-[#0d131c] p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-white">Episodes</h2>
              <div className="flex flex-wrap gap-3">
                {tvShow.seasons.filter((season) => season.season_number > 0).sort((a, b) => a.season_number - b.season_number).map((season) => (
                  <button
                    key={season.id}
                    onClick={() => {
                      setSelectedSeason(season.season_number);
                      setSelectedEpisode(1);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium ${selectedSeason === season.season_number ? 'bg-cyan-300 text-slate-950' : 'border border-white/10 bg-white/5 text-gray-300'}`}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>
              {currentSeason?.episodes?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {currentSeason.episodes.sort((a, b) => a.episode_number - b.episode_number).map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                      className={`px-3 py-2 rounded-lg font-medium ${selectedEpisode === episode.episode_number ? 'bg-cyan-300 text-slate-950' : 'border border-white/10 bg-white/5 text-gray-300'}`}
                      title={episode.name}
                    >
                      {episode.episode_number}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Loading episodes...</p>
              )}
              {currentEpisode ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">S{selectedSeason}E{selectedEpisode}: {currentEpisode.name}</h3>
                  {currentEpisode.overview ? <p className="text-gray-300">{currentEpisode.overview}</p> : null}
                </div>
              ) : null}
              {isLoading ? (
                <div className="aspect-video rounded-lg border border-white/10 bg-[#101722] flex items-center justify-center">Loading episode...</div>
              ) : error ? (
                <div className="aspect-video rounded-lg border border-white/10 bg-[#101722] flex items-center justify-center text-red-400">{error}</div>
              ) : embedUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-xl">
                  <VideoPlayer embedUrl={embedUrl} />
                </div>
              ) : null}
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => navigateEpisode('prev')} className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">Previous Episode</button>
                <button onClick={() => navigateEpisode('next')} className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">Next Episode</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
