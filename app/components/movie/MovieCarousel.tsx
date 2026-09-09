'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import MovieCard from './MovieCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating: number;
  overview: string;
}

interface MovieCarouselProps {
  movies: Movie[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  if (movies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-sm text-slate-500">
        No titles available right now. Check back soon.
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView="auto"
      spaceBetween={24}
      className="movie-swiper"
    >
      {movies.map((movie) => (
        <SwiperSlide key={movie.id} className="!w-[200px]">
          <MovieCard {...movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
