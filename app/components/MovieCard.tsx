'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating?: number;
  voteCount?: number;
  overview?: string;
}

const MovieCard = ({ id, title, poster, year, rating = 0, voteCount = 0, overview = '' }: MovieCardProps) => {
  return (
    <Link href={`/movie/${id}`} className="group">
      <div className="relative w-[200px] h-[300px] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
        {poster ? (
          <>
            <Image
              src={poster}
              alt={title}
              fill
              className="object-cover"
              sizes="200px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 p-4 text-white space-y-2">
                <h3 className="font-semibold text-sm">{title}</h3>
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">{rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{year}</span>
                  {voteCount > 0 && <span>{voteCount} votes</span>}
                </div>
                <p className="text-xs line-clamp-2 text-gray-300">{overview}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
