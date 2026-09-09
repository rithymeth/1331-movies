'use client';

import { useEffect, useState } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';

const STORAGE_KEY = '1331-movies-watchlist';

interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

export default function WatchlistButton({ item }: { item: WatchlistItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as WatchlistItem[];
    setSaved(stored.some((entry) => entry.id === item.id && entry.type === item.type));
  }, [item.id, item.type]);

  const toggleSaved = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as WatchlistItem[];
    const exists = stored.some((entry) => entry.id === item.id && entry.type === item.type);
    const next = exists
      ? stored.filter((entry) => !(entry.id === item.id && entry.type === item.type))
      : [...stored, item];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(!exists);
  };

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        saved
          ? 'border-cyan-300/40 bg-cyan-300 text-slate-950'
          : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      <BookmarkIcon className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
