import { MetadataRoute } from 'next';

async function getMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`);
  const data = await res.json();
  return data.results;
}

async function getTVShows() {
  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`);
  const data = await res.json();
  return data.results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://1331-movies-kh.com';

  // Get dynamic routes
  const [movies, tvShows] = await Promise.all([getMovies(), getTVShows()]);

  // Static routes
  const routes = ['', '/search', '/movies', '/tv-shows'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  // Movie routes
  const movieRoutes = movies.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: new Date(movie.release_date || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // TV Show routes
  const tvShowRoutes = tvShows.map((show: any) => ({
    url: `${baseUrl}/tv-shows/${show.id}`,
    lastModified: new Date(show.first_air_date || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...routes, ...movieRoutes, ...tvShowRoutes];
}
