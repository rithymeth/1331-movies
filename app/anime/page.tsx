'use client';

import { useState, useEffect } from 'react';
import AnimeCard from '../components/movie/AnimeCard';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6 animate-fade-in-up">
            Anime Collection
          </h1>
          <p className="text-gray-300 text-lg mb-8 animate-fade-in-up delay-200">
            Discover amazing anime series and movies
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fade-in-up delay-300">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchAnime(searchQuery)}
                placeholder="Search anime..."
                className="w-full px-6 py-4 rounded-2xl glass-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all duration-300 border border-white/10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <button
              onClick={() => searchAnime(searchQuery)}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-300 text-lg">Loading anime...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in-up delay-500">
            {animeList.map((anime, index) => (
              <div
                key={anime.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && animeList.length === 0 && (
          <div className="text-center py-20">
            <div className="glass-dark rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No anime found</h3>
              <p className="text-gray-400">Try searching for a different anime title</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
