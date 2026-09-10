export const WATCHLIST_STORAGE_KEY = '1331-movies-watchlist';

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

function isWatchlistItem(value: unknown): value is WatchlistItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'number' &&
    Number.isFinite(item.id) &&
    (item.type === 'movie' || item.type === 'tv') &&
    typeof item.title === 'string' &&
    (typeof item.posterPath === 'string' || item.posterPath === null)
  );
}

function normalizeWatchlist(items: unknown[]) {
  const uniqueItems = new Map<string, WatchlistItem>();

  items.forEach((value) => {
    if (!isWatchlistItem(value)) {
      return;
    }

    const item: WatchlistItem = {
      id: value.id,
      type: value.type,
      title: value.title.trim(),
      posterPath: value.posterPath
    };

    if (!item.title) {
      return;
    }

    uniqueItems.set(`${item.type}-${item.id}`, item);
  });

  return [...uniqueItems.values()];
}

function readStorageValue() {
  try {
    const value = JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function readWatchlist() {
  return normalizeWatchlist(readStorageValue());
}

export function writeWatchlist(items: WatchlistItem[]) {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(normalizeWatchlist(items)));
}

export function toggleWatchlistItem(item: WatchlistItem) {
  const currentItems = readWatchlist();
  const key = `${item.type}-${item.id}`;
  const exists = currentItems.some((entry) => `${entry.type}-${entry.id}` === key);
  const nextItems = exists
    ? currentItems.filter((entry) => `${entry.type}-${entry.id}` !== key)
    : [...currentItems, item];

  writeWatchlist(nextItems);
  return !exists;
}

export function clearWatchlist() {
  localStorage.removeItem(WATCHLIST_STORAGE_KEY);
}

export function parseSharedWatchlist(sharedValue: string | null) {
  if (!sharedValue) {
    return [];
  }

  try {
    const decodedValue = JSON.parse(decodeURIComponent(sharedValue));
    return Array.isArray(decodedValue) ? normalizeWatchlist(decodedValue) : [];
  } catch {
    return [];
  }
}
