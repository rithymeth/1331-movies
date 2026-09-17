'use client';

import { useEffect, useState } from 'react';
import MovieCarousel from './MovieCarousel';
import { readWatchHistory, WatchHistoryItem } from '@/app/lib/watchHistory';
import { mapTmdbMediaCollection, MediaCardItem } from '@/app/lib/media';
import { TmdbMediaListItem } from '@/app/lib/tmdb';

export default function BecauseYouWatched() {
  const [source, setSource] = useState<WatchHistoryItem | null>(null);
  const [items, setItems] = useState<MediaCardItem[]>([]);

  useEffect(() => {
    const history = readWatchHistory();
    const latest = history[0];
    if (!latest) return;
    setSource(latest);

    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(`/api/similar/${latest.type}/${latest.id}`, { signal: controller.signal });
        const data = await response.json();
        const mapped = mapTmdbMediaCollection((data.results || []) as TmdbMediaListItem[], latest.type)
          .filter((item) => item.id !== String(latest.id))
          .slice(0, 12);
        setItems(mapped);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setItems([]);
        }
      }
    };

    load();
    return () => controller.abort();
  }, []);

  if (!source || items.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up space-y-4">
      <div className="border-b border-white/10 pb-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Based on your library</p>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Because you watched {source.title}</h2>
      </div>
      <MovieCarousel movies={items} />
    </section>
  );
}
