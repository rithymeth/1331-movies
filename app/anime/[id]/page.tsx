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
  };
  description: string;
  coverImage: {
    large: string;
  };
  bannerImage: string;
  episodes: number;
  status: string;
  averageScore: number;
  genres: string[];
}

interface Props {
  params: {
    id: string;
  };
}

export default function AnimePage({ params }: Props) {
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

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
              <h2 className="text-2xl font-semibold text-white">Watch Episode</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: anime.episodes }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setSelectedEpisode(ep)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedEpisode === ep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Episode {ep}
                  </button>
                ))}
              </div>

              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                <iframe
                  src={`https://9anime.gs/watch/${anime.idMal}?ep=${selectedEpisode}`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
