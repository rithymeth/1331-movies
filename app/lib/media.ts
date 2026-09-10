import {
  getMediaYear,
  getTmdbImageUrl,
  MediaSort,
  MediaType,
  sortTmdbMediaResults,
  TmdbMediaListItem
} from '@/app/lib/tmdb';

export interface MediaCardItem {
  id: string;
  mediaType: MediaType;
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating: number;
  voteCount: number;
  overview: string;
  releaseDate: string | null;
  popularity: number;
}

export function mapTmdbMediaToCard(
  item: TmdbMediaListItem,
  mediaType: MediaType
): MediaCardItem {
  const releaseDate = item.release_date || item.first_air_date || null;

  return {
    id: item.id.toString(),
    mediaType,
    title: item.title || item.name || 'Untitled',
    poster: getTmdbImageUrl(item.poster_path, 'w500'),
    backdrop: getTmdbImageUrl(item.backdrop_path, 'original'),
    year: getMediaYear(releaseDate),
    rating: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    overview: item.overview || '',
    releaseDate,
    popularity: item.popularity || 0
  };
}

export function mapTmdbMediaCollection(
  items: TmdbMediaListItem[],
  mediaType: MediaType
) {
  return items.map((item) => mapTmdbMediaToCard(item, mediaType));
}

export function sortMediaCards(items: MediaCardItem[], sort: MediaSort = 'popularity.desc') {
  return sortTmdbMediaResults(
    items.map((item) => ({
      id: Number(item.id),
      title: item.mediaType === 'movie' ? item.title : undefined,
      name: item.mediaType === 'tv' ? item.title : undefined,
      poster_path: null,
      backdrop_path: null,
      release_date: item.mediaType === 'movie' ? item.releaseDate || undefined : undefined,
      first_air_date: item.mediaType === 'tv' ? item.releaseDate || undefined : undefined,
      vote_average: item.rating,
      vote_count: item.voteCount,
      popularity: item.popularity,
      overview: item.overview
    })),
    sort
  ).map((sortedItem) => items.find((item) => item.id === sortedItem.id.toString())!)
}
