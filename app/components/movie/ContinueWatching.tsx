'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTmdbImageUrl } from '@/app/lib/tmdb';
import { readWatchHistory, removeWatchHistory, WatchHistoryItem } from '@/app/lib/watchHistory';

export default function ContinueWatching() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setItems(readWatchHistory());
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up">
      <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Pick up where you left off</p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Continue watching</h2>
        </div>
        <Link href="/library" className="text-xs font-medium text-slate-400 transition hover:text-white">
          Open library
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const href = item.type === 'tv' ? `/tv-shows/${item.id}` : `/movie/${item.id}`;
          const poster = getTmdbImageUrl(item.posterPath, 'w500');
          return (
            <div key={`${item.type}-${item.id}`} className="w-[160px] shrink-0">
              <Link href={href} className="group block overflow-hidden rounded-xl border border-white/10 bg-[#11161d]">
                <div className="relative aspect-[2/3]">
                  {poster ? (
                    <Image src={poster} alt={item.title} fill className="object-cover transition group-hover:scale-105" sizes="160px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                  )}
                </div>
              </Link>
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.type === 'tv' ? 'Series' : 'Movie'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeWatchHistory(item);
                    setItems(readWatchHistory());
                  }}
                  className="text-xs text-slate-500 hover:text-white"
                  aria-label={`Remove ${item.title} from continue watching`}
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
