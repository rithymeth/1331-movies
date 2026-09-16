'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import EmptyState from '@/app/components/ui/EmptyState';
import { MediaCardItem } from '@/app/lib/media';

import 'swiper/css';
import 'swiper/css/navigation';

interface MovieCarouselProps {
  movies: MediaCardItem[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  if (movies.length === 0) {
    return <EmptyState title="No titles available" message="Check back soon for the latest catalog updates." compact />;
  }

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView="auto"
      spaceBetween={24}
      className="movie-swiper"
    >
      {movies.map((item) => (
        <SwiperSlide key={`${item.mediaType}-${item.id}`} className="!w-[200px]">
          {item.mediaType === 'tv' ? (
            <TVShowCard
              id={item.id}
              name={item.title}
              poster={item.poster}
              year={item.year}
              rating={item.rating}
              voteCount={item.voteCount}
              overview={item.overview}
            />
          ) : (
            <MovieCard
              id={item.id}
              title={item.title}
              poster={item.poster}
              year={item.year}
              rating={item.rating}
              voteCount={item.voteCount}
              overview={item.overview}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
