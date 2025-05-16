'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TVShowCardProps {
  id: string;
  name: string;
  poster: string | null;
  year: string;
  rating?: number;
  voteCount?: number;
  overview?: string;
}

const TVShowCard = ({ id, name, poster, year, rating = 0, voteCount = 0, overview = '' }: TVShowCardProps) => {
  return (
    <Link href={`/tv-shows/${id}`} className="block">
      <div className="relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-800/80 border border-gray-700/50 group-hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20">
        <div className="aspect-[2/3] relative">
          {poster ? (
            <>
              <Image
                src={poster}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{overview}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-400">{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default TVShowCard;
