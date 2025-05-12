import React from 'react';
import TVShowCard from '../components/TVShowCard';
import Image from 'next/image';

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

async function getTVShows() {
  const [popularRes, topRatedRes, airingTodayRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`)
  ]);

  const [popular, topRated, airingToday] = await Promise.all([
    popularRes.json(),
    topRatedRes.json(),
    airingTodayRes.json()
  ]);

  return {
    popular: popular.results,
    topRated: topRated.results,
    airingToday: airingToday.results
  };
}

export default async function TVShowsPage() {
  const { popular, topRated, airingToday } = await getTVShows();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${popular[0]?.poster_path}`}
          alt="Featured TV Show"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">TV Shows</h1>
            <p className="text-base sm:text-xl text-gray-200 max-w-md mx-auto">Discover your next binge-worthy series</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Popular TV Shows */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Popular TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {popular.map((show: TVShow) => (
              <TVShowCard
                key={show.id}
                id={show.id.toString()}
                name={show.name}
                poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                year={new Date(show.first_air_date).getFullYear().toString()}
                rating={show.vote_average}
                voteCount={show.vote_count}
                overview={show.overview}
              />
            ))}
          </div>
        </section>

        {/* Top Rated TV Shows */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Top Rated TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {topRated.map((show: TVShow) => (
              <TVShowCard
                key={show.id}
                id={show.id.toString()}
                name={show.name}
                poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                year={new Date(show.first_air_date).getFullYear().toString()}
                rating={show.vote_average}
                voteCount={show.vote_count}
                overview={show.overview}
              />
            ))}
          </div>
        </section>

        {/* Airing Today */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Airing Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {airingToday.map((show: TVShow) => (
              <TVShowCard
                key={show.id}
                id={show.id.toString()}
                name={show.name}
                poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                year={new Date(show.first_air_date).getFullYear().toString()}
                rating={show.vote_average}
                voteCount={show.vote_count}
                overview={show.overview}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
