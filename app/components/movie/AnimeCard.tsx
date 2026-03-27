'use client';

import Image from 'next/image';
import Link from 'next/link';

interface AnimeCardProps {
  anime: {
    id: number;
    title: {
      romaji: string;
      english: string;
    };
    coverImage: {
      large: string;
    };
    averageScore: number;
    episodes: number;
  };
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className="block group">
      <div className="relative h-80 w-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 glass-dark border border-white/10 hover:border-purple-500/30">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        {/* Image Container */}
        <div className="relative h-full w-full">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Rating Badge */}
          {anime.averageScore && (
            <div className="absolute top-3 right-3 glass-dark px-3 py-1 rounded-full border border-white/20">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-white">{(anime.averageScore / 10).toFixed(1)}</span>
              </div>
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                  {anime.title.english || anime.title.romaji}
                </h3>
                {anime.title.english && anime.title.romaji !== anime.title.english && (
                  <p className="text-sm text-gray-300 line-clamp-1">{anime.title.romaji}</p>
                )}
              </div>
              
              {/* Episodes Info */}
              {anime.episodes && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                  </svg>
                  <span className="text-sm">{anime.episodes} Episodes</span>
                </div>
              )}
              
              {/* Watch Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                  </svg>
                  <span>Watch Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
