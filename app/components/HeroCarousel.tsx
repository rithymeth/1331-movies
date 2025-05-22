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
    <section className="relative h-[90vh] w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="relative">
            {movie.backdrop && (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={movie.backdrop}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-16 space-y-6 max-w-7xl mx-auto">
                  <h1 className="text-6xl font-bold text-white drop-shadow-lg">{movie.title}</h1>
                  <p className="text-xl max-w-2xl text-gray-200 drop-shadow">{movie.overview}</p>
                  <div className="flex items-center gap-4">
                    <Link 
                      href={`/movie/${movie.id}`}
                      className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 inline-flex items-center gap-2 font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch Now
                    </Link>
                    <button className="bg-gray-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 font-semibold">
                      More Info
                    </button>
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
