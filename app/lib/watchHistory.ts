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

function isWatchHistoryItem(value: unknown): value is WatchHistoryItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === 'number' &&
    Number.isFinite(item.id) &&
    (item.type === 'movie' || item.type === 'tv') &&
    typeof item.title === 'string' &&
    (typeof item.posterPath === 'string' || item.posterPath === null) &&
    typeof item.watchedAt === 'number' &&
    Number.isFinite(item.watchedAt) &&
    (item.season === undefined || typeof item.season === 'number') &&
    (item.episode === undefined || typeof item.episode === 'number') &&
    (item.episodeTitle === undefined || typeof item.episodeTitle === 'string')
  );
}

function normalizeWatchHistory(items: unknown[]) {
  const dedupedItems = new Map<string, WatchHistoryItem>();

  items.forEach((value) => {
    if (!isWatchHistoryItem(value)) {
      return;
    }

    const item: WatchHistoryItem = {
      id: value.id,
      type: value.type,
      title: value.title.trim(),
      posterPath: value.posterPath,
      watchedAt: value.watchedAt,
      season: value.season,
      episode: value.episode,
      episodeTitle: value.episodeTitle?.trim()
    };

    if (!item.title) {
      return;
    }

    dedupedItems.set(`${item.type}-${item.id}`, item);
  });

  return [...dedupedItems.values()].sort((a, b) => b.watchedAt - a.watchedAt);
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
    return Array.isArray(value) ? normalizeWatchHistory(value) : [];
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
