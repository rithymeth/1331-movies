'use client';

import { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';

interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  episodes: number;
  averageScore: number;
}

export default function AnimePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAnime = async (query: string) => {
    if (!query) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query ($search: String) {
              Page(page: 1, perPage: 20) {
                media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
                  id
                  title {
                    romaji
                    english
                  }
                  coverImage {
                    large
                  }
                  episodes
                  averageScore
                }
              }
            }
          `,
          variables: {
            search: query
          }
        }),
      });
      const data = await response.json();
      if (data.data?.Page?.media) {
        setAnimeList(data.data.Page.media);
      }
    } catch (error) {
      console.error('Error searching anime:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Load trending anime on mount
    const loadTrendingAnime = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/anime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                Page(page: 1, perPage: 20) {
                  media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      large
                    }
                    episodes
                    averageScore
                  }
                }
              }
            `,
          }),
        });
        const data = await response.json();
        if (data.data?.Page?.media) {
          setAnimeList(data.data.Page.media);
        }
      } catch (error) {
        console.error('Error loading trending anime:', error);
      }
      setIsLoading(false);
    };

    loadTrendingAnime();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Anime</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchAnime(searchQuery)}
            placeholder="Search anime..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => searchAnime(searchQuery)}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}
