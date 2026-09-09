export const WATCH_HISTORY_KEY = '1331-movies-history';

export interface WatchHistoryItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  watchedAt: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
}

export function saveWatchHistory(item: Omit<WatchHistoryItem, 'watchedAt'>) {
  const stored = readWatchHistory().filter(
    (entry) => !(entry.id === item.id && entry.type === item.type)
  );
  localStorage.setItem(
    WATCH_HISTORY_KEY,
    JSON.stringify([{ ...item, watchedAt: Date.now() }, ...stored].slice(0, 10))
  );
}

export function readWatchHistory(): WatchHistoryItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function removeWatchHistory(item: Pick<WatchHistoryItem, 'id' | 'type'>) {
  const next = readWatchHistory().filter(
    (entry) => !(entry.id === item.id && entry.type === item.type)
  );
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(next));
}

export function clearWatchHistory() {
  localStorage.removeItem(WATCH_HISTORY_KEY);
}
