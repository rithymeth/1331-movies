'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import VideoPlayer from './VideoPlayer';

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  episodes?: Episode[];
}

interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

interface EpisodeListProps {
  seasons: Season[];
  showId: string;
  imdbId: string;
  episodeVideos: { [key: string]: Video[] };
}

export default function EpisodeList({ seasons, showId, imdbId, episodeVideos }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSeasonChange = async (seasonNumber: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/tv/${showId}/season/${seasonNumber}`
      );
      const data = await response.json();
      const season = {
        ...data,
        season_number: seasonNumber
      };
      setSelectedSeason(season);
      setSelectedEpisode(null);
    } catch (error) {
      console.error('Error fetching season data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => handleSeasonChange(season.season_number)}
            className={`px-4 py-2 rounded-full ${
              selectedSeason.season_number === season.season_number
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      {selectedEpisode && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            {selectedEpisode.name}
          </h3>
          <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
            <VideoPlayer
              type="vidsrc"
              videoKey=""
              imdbId={imdbId}
              season={selectedEpisode.season_number}
              episode={selectedEpisode.episode_number}
            />
          </div>
          <p className="text-gray-300">{selectedEpisode.overview}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedSeason.episodes?.map((episode) => (
          <div
            key={episode.id}
            className={`cursor-pointer group rounded-lg overflow-hidden bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 ${
              selectedEpisode?.id === episode.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedEpisode(episode)}
          >
            <div className="aspect-video relative">
              {episode.still_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No Preview</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-sm font-medium text-white">
                  Episode {episode.episode_number}
                </div>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {episode.name}
              </h4>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {episode.overview || 'No description available.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
