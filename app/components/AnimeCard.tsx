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
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105">
        <Image
          src={anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white space-y-1 w-full">
            <h3 className="font-semibold text-base leading-tight">{anime.title.english || anime.title.romaji}</h3>
            {anime.episodes && (
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>{anime.episodes} Episodes</span>
              </div>
            )}
            {anime.averageScore && (
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{(anime.averageScore / 10).toFixed(1)}</span>
              </div>
            )}
            {anime.title.english && anime.title.romaji !== anime.title.english && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{anime.title.romaji}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{anime.title.english || anime.title.romaji}</h3>
        {anime.title.english && anime.title.romaji !== anime.title.english && (
          <p className="text-xs text-gray-400">{anime.title.romaji}</p>
        )}
      </div>
    </Link>
  );
}
