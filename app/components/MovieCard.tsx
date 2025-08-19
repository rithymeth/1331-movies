'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MovieCardProps {
  id: string;
  title: string;
  poster: string | null;
  year: string;
  rating?: number;
  voteCount?: number;
  overview?: string;
}

const MovieCard = ({ id, title, poster, year, rating = 0, voteCount = 0, overview = '' }: MovieCardProps) => {
  return (
    <Link href={`/movie/${id}`} className="group block">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-glow-lg animate-scale-in">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        
        {/* Main card */}
        <div className="relative h-full card-modern overflow-hidden">
          {poster ? (
            <>
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                priority={false}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Rating badge */}
                {rating > 0 && (
                  <div className="absolute top-4 right-4 glass-dark px-3 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Title and year */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">{title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400 font-semibold">{year}</span>
                    {voteCount > 0 && (
                      <span className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {voteCount.toLocaleString()} votes
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Overview */}
                <p className="text-sm text-gray-300 line-clamp-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 mt-2">
                  {overview}
                </p>
                
                {/* Play button */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Now
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full glass-dark flex items-center justify-center">
              <div className="text-center space-y-2">
                <svg className="w-12 h-12 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">{title}</h3>
        <p className="text-xs text-gray-400">{year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
