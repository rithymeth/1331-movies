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
