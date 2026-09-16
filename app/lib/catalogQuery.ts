export type CatalogSort = 'popular' | 'rating' | 'date';

export interface CatalogQuery {
  genre?: string;
  sort?: CatalogSort;
  year?: string;
  country?: string;
  page?: number;
}

export const catalogCountries = [
  { code: 'US', label: 'USA' },
  { code: 'GB', label: 'UK' },
  { code: 'KR', label: 'Korea' },
  { code: 'JP', label: 'Japan' },
  { code: 'IN', label: 'India' },
  { code: 'FR', label: 'France' },
  { code: 'CN', label: 'China' },
  { code: 'TH', label: 'Thailand' },
  { code: 'KH', label: 'Cambodia' },
  { code: 'ES', label: 'Spain' }
] as const;

export function parseCatalogSort(value?: string): CatalogSort {
  return value === 'rating' || value === 'date' ? value : 'popular';
}

export function parseCatalogYear(value?: string) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1950 || year > 2030) {
    return undefined;
  }
  return String(year);
}

export function parseCatalogCountry(value?: string) {
  return catalogCountries.some((country) => country.code === value) ? value : undefined;
}

export function catalogHref(basePath: string, query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.genre) params.set('genre', query.genre);
  if (query.sort && query.sort !== 'popular') params.set('sort', query.sort);
  if (query.year) params.set('year', query.year);
  if (query.country) params.set('country', query.country);
  if (query.page && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}

export function tmdbSortParam(sort: CatalogSort, mediaType: 'movie' | 'tv') {
  if (sort === 'rating') return 'vote_average.desc';
  if (sort === 'date') return mediaType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
  return 'popularity.desc';
}

export function catalogYearOptions(now = new Date().getFullYear()) {
  return Array.from({ length: 10 }, (_, index) => String(now - index));
}
