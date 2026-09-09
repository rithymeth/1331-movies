const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTmdbList<T>(endpoint: string): Promise<T[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US&page=1`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`TMDB request failed for ${endpoint}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.error(`TMDB request error for ${endpoint}:`, error);
    return [];
  }
}
