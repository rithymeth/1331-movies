'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoPlayer from '../../components/VideoPlayer';

interface AnimeDetails {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    large: string;
    extraLarge: string;
  };
  bannerImage: string;
  episodes: number;
  status: string;
  averageScore: number;
  genres: string[];
  streamingEpisodes: Array<{
    title: string;
    thumbnail: string;
    url: string;
  }>;
  externalLinks: Array<{
    url: string;
    site: string;
  }>;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
  };
}

interface Props {
  params: {
    id: string;
  };
}

export default function AnimePage({ params }: Props) {
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subType, setSubType] = useState<'sub' | 'dub'>('sub');

  const loadEpisode = async (episode: number) => {
    setIsLoading(true);
    setError(null);
    setCurrentUrlIndex(0);
    try {
      if (!anime) {
        throw new Error('Anime details not found');
      }

      // Determine the ID prefix based on the source
      let animeId = params.id;
      if (animeId.startsWith('mal')) {
        // MyAnimeList ID - remove 'mal' prefix
        animeId = animeId.replace('mal', '');
      } else if (!animeId.startsWith('ani') && !animeId.startsWith('tt') && !animeId.startsWith('tmdb')) {
        // Default to TMDB if no prefix
        animeId = `tmdb${animeId}`;
      }

      // Construct the embed URL according to the API documentation
      const embedUrl = `https://vidsrc.cc/v2/embed/anime/${animeId}/${episode}/${subType}?autoPlay=true&autoSkipIntro=true`;
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
    if (anime && selectedEpisode) {
      loadEpisode(selectedEpisode);
    }
  }, [selectedEpisode, anime]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch('/api/anime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query ($id: Int) {
                Media(id: $id, type: ANIME) {
                  id
                  title {
                    romaji
                    english
                  }
                  description
                  coverImage {
                    large
                  }
                  bannerImage
                  episodes
                  status
                  averageScore
                  genres
                }
              }
            `,
            variables: {
              id: parseInt(params.id)
            }
          }),
        });
        const data = await response.json();
        if (data.data?.Media) {
          setAnime(data.data.Media);
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };

    fetchAnimeDetails();
  }, [params.id]);

  if (!anime) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {anime.bannerImage && (
        <div className="relative h-[400px] w-full">
          <Image
            src={anime.bannerImage}
            alt={anime.title.english || anime.title.romaji}
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
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {anime.title.english || anime.title.romaji}
            </h1>
            {anime.title.english && anime.title.romaji !== anime.title.english && (
              <h2 className="text-xl text-gray-400 mb-4">{anime.title.romaji}</h2>
            )}

            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue-400">{anime.status}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400">{anime.episodes} Episodes</span>
              {anime.averageScore && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">★ {anime.averageScore / 10}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div
              className="text-gray-300 mb-8"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Watch Episode</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSubType(subType === 'sub' ? 'dub' : 'sub')}
                      className={`px-4 py-2 rounded ${subType === 'sub' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                    >
                      SUB
                    </button>
                    <button
                      onClick={() => setSubType(subType === 'sub' ? 'dub' : 'sub')}
                    >
                      DUB
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                  {Array.from({ length: anime.episodes || 0 }, (_, i) => i + 1).map((ep) => (
                    <button
                      key={ep}
                      onClick={() => {
                        setSelectedEpisode(ep);
                        loadEpisode(ep);
                      }}
                      className={`p-2 text-sm rounded-lg transition-colors ${selectedEpisode === ep
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      EP {ep}
                    </button>
                  ))}
                </div>

                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-white text-lg">Loading episode...</p>
                      </div>
                    </div>
                  ) : embedUrl ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ border: 'none' }}
                      />
                      <div className="absolute top-4 right-4 z-10 flex space-x-2">
                        {currentUrlIndex > 0 && (
                          <button
                            onClick={() => {
                              setCurrentUrlIndex(0);
                              setEmbedUrl(embedUrl);
                            }}
                            className="px-3 py-1 bg-gray-800/80 hover:bg-gray-700 text-white text-sm rounded-full transition-colors"
                            title="Switch to primary source"
                          >
                            Source 1
                          </button>
                        )}
                        {fallbackUrls.length > 0 && currentUrlIndex < fallbackUrls.length && (
                          <button
                            onClick={() => {
                              const nextIndex = currentUrlIndex + 1;
                              setCurrentUrlIndex(nextIndex);
                              setEmbedUrl(fallbackUrls[nextIndex - 1]);
                            }}
                            className="px-3 py-1 bg-gray-800/80 hover:bg-gray-700 text-white text-sm rounded-full transition-colors"
                            title="Try alternate source"
                          >
                            Source {currentUrlIndex + 2}
                          </button>
                        )}
                        <button
                          onClick={() => loadEpisode(selectedEpisode)}
                          className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700 text-white text-sm rounded-full transition-colors"
                          title="Refresh video"
                        >
                          ↻ Refresh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-gray-900/50 backdrop-blur-sm">
                      {error ? (
                        <>
                          <p className="text-red-500 text-lg text-center px-4 max-w-lg">{error}</p>
                          <button
                            onClick={() => loadEpisode(selectedEpisode)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <span>↻</span>
                            <span>Try Again</span>
                          </button>
                        </>
                      ) : (
                        <p className="text-white text-lg">Select an episode to watch</p>
                      )}
                    </div>
                  )}
                </div>
                
                {anime.streamingEpisodes && anime.streamingEpisodes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Official Streaming Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.streamingEpisodes.map((ep, index) => (
                        <a
                          key={index}
                          href={ep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                        >
                          Episode {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {anime.externalLinks && anime.externalLinks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">External Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.externalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                        >
                          {link.site}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
