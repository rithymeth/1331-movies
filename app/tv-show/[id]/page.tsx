import React from 'react';
import Image from 'next/image';

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
  air_date: string;
  overview: string;
  poster_path: string | null;
  episodes?: Episode[];
}

interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  seasons: Season[];
  external_ids: {
    imdb_id: string;
  };
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

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getTVShowDetails(id: string): Promise<{ show: TVShowDetails; cast: CastMember[]; videos: Video[]; episodeVideos: { [key: string]: Video[] } }> {
  const [showRes, creditsRes, videosRes, seasonsRes, externalIdsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`)
  ]);

  if (!showRes.ok || !creditsRes.ok || !videosRes.ok || !seasonsRes.ok || !externalIdsRes.ok) {
    throw new Error('Failed to fetch TV show data');
  }

  const [showData, credits, videos, firstSeasonData, externalIds] = await Promise.all([
    showRes.json(),
    creditsRes.json(),
    videosRes.json(),
    seasonsRes.json(),
    externalIdsRes.json()
  ]);

  // Filter for YouTube trailers and teasers for the show
  const filteredVideos = videos.results.filter(
    (video: Video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );

  // Fetch episode videos for the first season
  const episodeVideosRes = await Promise.all(
    firstSeasonData.episodes.map((episode: Episode) =>
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/1/episode/${episode.episode_number}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
    )
  );

  const episodeVideosData = await Promise.all(
    episodeVideosRes.map(res => res.json())
  );

  // Create a map of episode number to its videos
  const episodeVideos: { [key: string]: Video[] } = {};
  firstSeasonData.episodes.forEach((episode: Episode, index: number) => {
    const videos = episodeVideosData[index].results.filter(
      (video: Video) => video.site === 'YouTube'
    );
    if (videos.length > 0) {
      episodeVideos[`${episode.season_number}_${episode.episode_number}`] = videos;
    }
  });

  // Add episodes to the first season
  const seasonsWithEpisodes = showData.seasons.map((season: Season) => 
    season.season_number === 1 ? { ...season, episodes: firstSeasonData.episodes } : season
  );

  return {
    show: { ...showData, seasons: seasonsWithEpisodes, external_ids: externalIds },
    cast: credits.cast.slice(0, 6),
    videos: filteredVideos,
    episodeVideos
  };
}

import VideoPlayer from '../../components/VideoPlayer';
import EpisodeList from '../../components/EpisodeList';

export default async function TVShowPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const { show, cast, videos, episodeVideos } = await getTVShowDetails(id);

  return (
    <div>
      <div className="relative h-[400px] w-full">
        {show.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
              alt={show.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-800" />
        )}
      </div>

      <div className="max-w-6xl mx-auto -mt-32 relative z-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-gray-800 shadow-xl">
            {show.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white">{show.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-gray-400">
                <span>{new Date(show.first_air_date).getFullYear()}</span>
                <span>•</span>
                <span>{show.number_of_seasons} Seasons</span>
                <span>•</span>
                <span>{show.number_of_episodes} Episodes</span>
              </div>
            </div>

            {videos.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Trailer</h2>
                <VideoPlayer videoKey={videos[0].key} />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-gray-300">{show.overview}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
              <EpisodeList 
                seasons={show.seasons} 
                showId={id} 
                imdbId={show.external_ids.imdb_id}
                episodeVideos={episodeVideos} 
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {cast.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="aspect-[2/3] relative rounded overflow-hidden bg-gray-800">
                      {member.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-gray-400">{member.character}</p>
                    </div>
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
