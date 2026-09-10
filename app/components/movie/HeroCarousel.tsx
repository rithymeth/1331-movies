'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { MediaCardItem } from '@/app/lib/media';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroCarouselProps {
  movies: MediaCardItem[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  if (movies.length === 0) {
    return (
      <section className="flex h-[560px] items-end bg-[#080b10] px-5 pb-24 sm:px-8 md:h-[650px]">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">1331 Movies</p>
          <h1 className="max-w-2xl text-5xl font-black leading-none tracking-[-0.055em] text-white sm:text-7xl">
            Your next story starts here.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-slate-400">
            Movie catalog data is temporarily unavailable. Check your TMDB configuration, then refresh to explore the library.
          </p>
          <Link href="/movies" className="mt-7 inline-flex rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950">
            Browse the catalog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[680px] overflow-hidden bg-[#080b10] md:h-[760px]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop={movies.length > 1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <div className="absolute inset-0">
              {movie.backdrop && (
                <Image
                  src={movie.backdrop}
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover object-center opacity-60"
                  sizes="100vw"
                />
              )}
              <div className="absolute inset-0 bg-[#080b10]/45" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080b10] via-[#080b10]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-[#080b10]/20" />
            </div>

            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-5 pb-28 sm:px-8 md:items-center md:pb-0">
              <div className="max-w-2xl pt-20">
                <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                  <span className="h-px w-8 bg-cyan-300" />
                  Featured tonight
                </div>
                <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-7xl md:text-8xl">
                  {movie.title}
                </h1>
                <p className="mt-6 line-clamp-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                  {movie.overview || 'A new story is waiting for you.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
                  >
                    <span className="text-base">▶</span>
                    Watch now
                  </Link>
                  <Link
                    href={`/movie/${movie.id}`}
                    className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
                  >
                    View details
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-5 text-xs font-medium text-slate-400">
                  <span className="rounded border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-emerald-200">HD</span>
                  <span>Free to watch</span>
                  <span>Powered by Vidking</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
