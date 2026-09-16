'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/movie/VideoPlayer';
import WatchTogether from '../../components/movie/WatchTogether';
import WatchlistButton from '../../components/movie/WatchlistButton';
import MovieCarousel from '../../components/movie/MovieCarousel';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { getVidkingMovieUrl } from '@/app/lib/vidking';
import { saveWatchHistory } from '@/app/lib/watchHistory';
import { getMediaYear, getTmdbImageUrl } from '@/app/lib/tmdb';
import { MediaCardItem } from '@/app/lib/media';

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
  similar?: MediaCardItem[];
}

export function MovieClient({ movie, cast, videos, similar = [] }: MovieClientProps) {
  const [showWatchTogether, setShowWatchTogether] = useState(false);
  const runtimeLabel = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'Runtime TBA';

  useEffect(() => {
    saveWatchHistory({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      posterPath: movie.poster_path
    });
  }, [movie.id, movie.title, movie.poster_path]);

  return (
    <div className="min-h-screen bg-[#080b10]">
      <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <>
            <Image
              src={getTmdbImageUrl(movie.backdrop_path, 'original') || ''}
              alt={movie.title}
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-[#080b10]/20" />
          </>
        ) : (
          <div className="w-full h-full bg-[#101722]" />
        )}
      </div>

      <div className="max-w-6xl mx-auto -mt-20 relative z-10 px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <div className="relative group">
            <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-[#121923] border border-white/10 shadow-2xl">
              {movie.poster_path ? (
                <Image
                  src={getTmdbImageUrl(movie.poster_path, 'w500') || ''}
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

          <div className="space-y-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  {movie.title}
                </h1>
                <WatchlistButton item={{ id: movie.id, type: 'movie', title: movie.title, posterPath: movie.poster_path }} />
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
                <span className="font-medium">{getMediaYear(movie.release_date)}</span>
                <span className="font-medium">{runtimeLabel}</span>
                <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1">
                  <span className="font-bold text-white">{(movie.vote_average || 0).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({(movie.vote_count || 0).toLocaleString()})</span>
                </div>
                {movie.imdb_id ? (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:text-white"
                  >
                    IMDb
                  </a>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {movie.overview && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Overview</h2>
                <p className="max-w-3xl text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            <div className="space-y-4 rounded-xl border border-white/10 bg-[#0d131c] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Watch movie</h2>
                <button
                  onClick={() => setShowWatchTogether(!showWatchTogether)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    showWatchTogether
                      ? 'bg-cyan-300 text-slate-950'
                      : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <UserGroupIcon className="w-5 h-5" />
                  <span className="font-medium">Watch Together</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-xl">
                  <VideoPlayer embedUrl={getVidkingMovieUrl(movie.id)} />
                </div>
                {showWatchTogether && (
                  <WatchTogether
                    contentId={movie.id.toString()}
                    contentType="movie"
                    contentTitle={movie.title}
                  />
                )}
              </div>

              {videos.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Trailers & Clips</h2>
                  <div className="grid gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="space-y-3">
                        <h3 className="text-xl font-semibold text-white">{video.name}</h3>
                        <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-xl">
                          <VideoPlayer
                            embedUrl={`https://www.youtube.com/embed/${video.key}?autoplay=0&controls=1&modestbranding=1`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cast.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {cast.map((member) => (
                    <div key={member.id} className="group text-center">
                      <div className="aspect-[2/3] relative rounded-lg overflow-hidden border border-white/10 bg-[#121923] mb-3">
                        {member.profile_path ? (
                          <Image
                            src={getTmdbImageUrl(member.profile_path, 'w185') || ''}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                        )}
                      </div>
                      <p className="font-semibold text-white truncate">{member.name}</p>
                      <p className="text-sm text-gray-400 truncate mt-1">{member.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {similar.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">More like this</h2>
                <MovieCarousel movies={similar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
