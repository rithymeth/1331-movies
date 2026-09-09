const VIDKING_BASE_URL = 'https://www.vidking.net';

export function getVidkingMovieUrl(tmdbId: number | string): string {
  return `${VIDKING_BASE_URL}/embed/movie/${tmdbId}`;
}

export function getVidkingEpisodeUrl(
  tmdbId: number | string,
  season: number | string,
  episode: number | string
): string {
  return `${VIDKING_BASE_URL}/embed/tv/${tmdbId}/${season}/${episode}`;
}
