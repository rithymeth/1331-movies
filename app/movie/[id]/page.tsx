import React from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/VideoPlayer';
import AdcashAd from '../../components/AdcashAd';
import PropellerAd from '../../components/PropellerAd';

interface MovieDetails {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
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

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getMovieDetails(id: string): Promise<{ movie: MovieDetails; cast: CastMember[]; videos: Video[] }> {
  const [movieRes, externalIdsRes, creditsRes, videosRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
  ]);

  if (!movieRes.ok || !externalIdsRes.ok || !creditsRes.ok || !videosRes.ok) {
    throw new Error('Failed to fetch movie data');
  }

  const [movieData, externalIds, credits, videos] = await Promise.all([
    movieRes.json(),
    externalIdsRes.json(),
    creditsRes.json(),
    videosRes.json()
  ]);

  // Filter for YouTube trailers and teasers
  const filteredVideos = videos.results.filter(
    (video: Video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );

  return {
    movie: {
      ...movieData,
      imdb_id: externalIds.imdb_id,
    },
    cast: credits.cast.slice(0, 6),
    videos: filteredVideos
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  const { movie, cast, videos } = await getMovieDetails(id);

  if (!movie.imdb_id) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        {movie && (
          <div className="container mx-auto px-4 py-8">
            {/* Dropdown Ad */}
          </div>
        )}
        <h1 className="text-2xl font-bold text-red-500">Movie Not Available</h1>
        <p className="text-gray-400 mt-2">
          Sorry, this movie is not available for streaming.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* PropellerAds Push Notifications */}
      <PropellerAd zoneId="5432109" adType="push" />
      {/* PropellerAds Interstitial */}
      <PropellerAd zoneId="5432110" adType="interstitial" />
      <div className="relative h-[400px] w-full">
        {movie.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
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
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
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
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <p>{new Date(movie.release_date).getFullYear()}</p>
                <p>•</p>
                <p>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                <p>•</p>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500">({movie.vote_count.toLocaleString()} votes)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Watch Movie</h2>
              
              {/* Ad before video */}
              <div className="mb-4">
                <AdcashAd zoneId="lxlvor92mg" />
              </div>

              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <VideoPlayer
                  embedUrl={`https://vidsrc.cc/v2/embed/movie/${movie.imdb_id}`}
                  fallbackUrls={[
                    `https://vidsrc.to/embed/movie/${movie.imdb_id}`,
                    `https://2embed.org/embed/${movie.imdb_id}`,
                    `https://streamtape.com/e/${movie.imdb_id}`,
                    `https://rapid-cloud.co/embed-6/movie?id=${movie.imdb_id}`
                  ]}
                />
              </div>

              {/* Ad after video */}
              <div className="mt-4">
                <AdcashAd zoneId="lxlvor92mg" />
              </div>
              {/* Ad before trailers */}
              <div className="mt-8 mb-4">
                <AdcashAd zoneId="lxlvor92mg" />
              </div>

              {videos.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Trailers & Clips</h2>
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        <h3 className="text-lg font-medium text-white">
                          {video.name}
                        </h3>
                        <VideoPlayer
                          embedUrl={`https://www.youtube.com/embed/${video.key}?autoplay=0&controls=1&modestbranding=1`}
                          fallbackUrls={[]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ad before cast */}
            <div className="mt-8 mb-4">
              <AdcashAd zoneId="lxlvor92mg" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cast.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                      {member.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-3xl">?</span>
                          <VideoPlayer
                            embedUrl={`https://www.youtube.com/embed/${videos[0].key}?autoplay=0&controls=1&modestbranding=1`}
                            fallbackUrls={[]}
                          />
                        </div>
                      )}
                    </div>
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-gray-400 truncate">{member.character}</p>
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
