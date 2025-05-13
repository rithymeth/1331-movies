'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/VideoPlayer';

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

  const loadEpisode = async (season: number, episode: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!tvShow) {
        throw new Error('TV Show details not found');
      }

      // Construct the embed URL according to the API documentation
      const embedUrl = `https://vidsrc.cc/v2/embed/tv/${params.id}/${season}/${episode}?autoPlay=true&poster=true`;
      setEmbedUrl(embedUrl);
      setFallbackUrls([]);
    } catch (error) {
      console.error('Error loading episode:', error);
      setError(error instanceof Error ? error.message : 'Failed to load episode. Please try again later.');
      setEmbedUrl(null);
      setFallbackUrls([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const response = await fetch(`/api/tv/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setTVShow(data);
          // Set initial season and episode
          if (data.seasons && data.seasons.length > 0) {
            setSelectedSeason(data.seasons[0].season_number);
            setSelectedEpisode(1);
          }
        } else {
          setError(data.error || 'Failed to load TV show details');
        }
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setError('Failed to load TV show details. Please try again later.');
      }
    };

    fetchTVShowDetails();
  }, [params.id]);

  useEffect(() => {
    if (tvShow && selectedSeason && selectedEpisode) {
      loadEpisode(selectedSeason, selectedEpisode);
    }
  }, [selectedSeason, selectedEpisode, tvShow]);

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

        {embedUrl && (
          <div className="mt-8">
            <VideoPlayer embedUrl={embedUrl} fallbackUrls={fallbackUrls} />
          </div>
        )}

        <div className="mt-8">
          <div className="text-white font-semibold mb-4">Seasons</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tvShow.seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => {
                  setSelectedSeason(season.season_number);
                  setSelectedEpisode(1);
                }}
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

        <div className="mt-8">
          <div className="text-white font-semibold mb-4">Episodes</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from(
              { length: tvShow.seasons.find(s => s.season_number === selectedSeason)?.episode_count || 0 },
              (_, i) => i + 1
            ).map((episodeNum) => (
              <button
                key={episodeNum}
                onClick={() => setSelectedEpisode(episodeNum)}
                className={`p-4 rounded-lg transition-all ${
                  selectedEpisode === episodeNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">Episode {episodeNum}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
