import { MetadataRoute } from 'next';

export const runtime = 'edge';

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

function formatDate(date: Date): string {
  // Ensure the date is valid and in W3C format (YYYY-MM-DD)
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

function getValidDate(dateStr?: string): Date {
  if (!dateStr) {
    return new Date();
  }
  const date = new Date(dateStr);
  
  // If date is invalid or older than 2 years ago, return current date
  if (isNaN(date.getTime()) || date.getTime() < Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)) {
    return new Date();
  }
  
  return date;
}

// Remove script tags and ensure valid sitemap format
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com';

  // Get dynamic routes
  const [movies, tvShows] = await Promise.all([getMovies(), getTVShows()]);

  // Static routes
  const routes = ['', '/search', '/movies', '/tv-shows'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'daily',
    priority: 1,
  }));

  // Movie routes
  const movieRoutes = movies.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: formatDate(getValidDate(movie.release_date)),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // TV Show routes
  const tvShowRoutes = tvShows.map((show: any) => ({
    url: `${baseUrl}/tv-shows/${show.id}`,
    lastModified: formatDate(getValidDate(show.first_air_date)),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...routes, ...movieRoutes, ...tvShowRoutes];
}
