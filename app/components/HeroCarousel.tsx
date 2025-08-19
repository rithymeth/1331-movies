'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Movie {
  id: string;
  title: string;
  backdrop: string | null;
  overview: string;
}

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  return (
    <section className="relative h-[95vh] w-full overflow-hidden">
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/6 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        effect="fade"
        className="h-full w-full"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id} className="relative">
            {movie.backdrop && (
              <>
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={movie.backdrop}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-[10s] ease-out scale-105 hover:scale-110"
                    priority={index === 0}
                  />
                  {/* Enhanced multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20" />
                </div>
                
                {/* Content */}
                <div className="relative z-20 h-full flex items-end">
                  <div className="container mx-auto px-8 pb-20 space-y-8 max-w-7xl animate-fade-in-up">
                    {/* Enhanced Title */}
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-white drop-shadow-2xl leading-tight max-w-5xl">
                      <span className="gradient-text animate-pulse-slow">{movie.title}</span>
                    </h1>
                    
                    {/* Enhanced Overview */}
                    <p className="text-xl lg:text-2xl max-w-3xl text-gray-200 drop-shadow-lg leading-relaxed font-light">
                      {movie.overview}
                    </p>
                    
                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                      <Link 
                        href={`/movie/${movie.id}`}
                        className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow-lg inline-flex items-center gap-3 font-bold text-lg overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative z-10 group-hover:animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span className="relative z-10">Watch Now</span>
                      </Link>
                      
                      <button className="group glass-dark backdrop-blur-xl text-white px-10 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300 transform hover:scale-105 font-bold text-lg border border-white/20 hover:border-purple-500/50 hover:shadow-glow">
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          More Info
                        </div>
                      </button>
                    </div>
                    
                    {/* Enhanced Movie metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-300 pt-2">
                      <div className="flex items-center gap-2 glass-dark px-3 py-1 rounded-full border border-white/10">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">Featured Movie</span>
                      </div>
                      <div className="flex items-center gap-2 glass-dark px-3 py-1 rounded-full border border-white/10">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">HD Quality</span>
                      </div>
                      <div className="flex items-center gap-2 glass-dark px-3 py-1 rounded-full border border-white/10">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Free to Watch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
