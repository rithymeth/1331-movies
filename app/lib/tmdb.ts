const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type MediaType = 'movie' | 'tv';
export type MediaSort = 'popularity.desc' | 'rating.desc' | 'date.desc';

export interface TmdbMediaListItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity?: number;
  overview: string;
}

interface TmdbListResponse<T> {
  results?: T[];
}

interface FetchTmdbOptions {
  params?: Record<string, string | number | boolean | null | undefined>;
  revalidate?: number;
  init?: RequestInit & { next?: { revalidate?: number } };
}

function getTmdbApiKey() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not configured');
    return null;
  }

  return apiKey;
}

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: 'w92' | 'w185' | 'w500' | 'original' = 'w500'
) {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

export function getMediaYear(dateValue?: string | null) {
  if (!dateValue) {
    return 'N/A';
  }

  const year = new Date(dateValue).getFullYear();
  return Number.isFinite(year) ? year.toString() : 'N/A';
}

export async function fetchTmdb<T>(
  endpoint: string,
  { params, revalidate = 3600, init }: FetchTmdbOptions = {}
): Promise<T | null> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${TMDB_BASE_URL}${normalizedEndpoint}`);

    if (!url.searchParams.has('api_key')) {
      url.searchParams.set('api_key', apiKey);
    }

    if (!url.searchParams.has('language')) {
      url.searchParams.set('language', 'en-US');
    }

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString(), {
      ...init,
      next: init?.next || { revalidate }
    });

    if (!response.ok) {
      console.error(`TMDB request failed for ${normalizedEndpoint}: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`TMDB request error for ${endpoint}:`, error);
    return null;
  }
}

export async function fetchTmdbList<T>(
  endpoint: string,
  options?: FetchTmdbOptions
): Promise<T[]> {
  const data = await fetchTmdb<TmdbListResponse<T>>(endpoint, {
    ...options,
    params: {
      page: 1,
      ...(options?.params || {})
    }
  });
  return Array.isArray(data?.results) ? data.results : [];
}

export function sortTmdbMediaResults<T extends TmdbMediaListItem>(
  items: T[],
  sort: MediaSort = 'popularity.desc'
) {
  return [...items].sort((a, b) => {
    switch (sort) {
      case 'rating.desc':
        return (b.vote_average || 0) - (a.vote_average || 0);
      case 'date.desc': {
        const dateA = new Date(a.release_date || a.first_air_date || '').getTime();
        const dateB = new Date(b.release_date || b.first_air_date || '').getTime();
        return dateB - dateA;
      }
      case 'popularity.desc':
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });
}
