'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpTrayIcon, BookmarkIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { clearWatchHistory, readWatchHistory, removeWatchHistory, WatchHistoryItem } from '@/app/lib/watchHistory';
import { clearWatchlist, parseSharedWatchlist, readWatchlist, WatchlistItem, writeWatchlist } from '@/app/lib/watchlist';

type Filter = 'all' | 'movie' | 'tv';

export default function LibraryPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let stored = readWatchlist();
    const sharedValue = new URLSearchParams(window.location.search).get('watchlist');

    if (sharedValue) {
      const sharedItems = parseSharedWatchlist(sharedValue);
      if (sharedItems.length > 0) {
        stored = [...stored, ...sharedItems];
        writeWatchlist(stored);
        stored = readWatchlist();
        window.history.replaceState({}, '', '/library');
        setShareMessage('Shared titles added to your library.');
      } else {
        setShareMessage('This shared library link is not valid.');
      }
    }

    setItems(stored);
    setHistory(readWatchHistory());
  }, []);

  const visibleItems = useMemo(
    () => filter === 'all' ? items : items.filter((item) => item.type === filter),
    [filter, items]
  );

  const removeItem = (item: WatchlistItem) => {
    const next = items.filter((entry) => !(entry.id === item.id && entry.type === item.type));
    writeWatchlist(next);
    setItems(next);
  };

  const removeHistoryItem = (item: WatchHistoryItem) => {
    removeWatchHistory(item);
    setHistory((current) => current.filter((entry) => !(entry.id === item.id && entry.type === item.type)));
  };

  const shareLibrary = async () => {
    if (items.length === 0) return;
    const shareUrl = `${window.location.origin}/library?watchlist=${encodeURIComponent(JSON.stringify(items))}`;
    await navigator.clipboard.writeText(shareUrl);
    setShareMessage('Share link copied.');
    window.setTimeout(() => setShareMessage(''), 2500);
  };

  const clearLibrary = () => {
    if (!window.confirm('Remove all saved titles and continue-watching history?')) return;
    clearWatchlist();
    clearWatchHistory();
    setItems([]);
    setHistory([]);
    setShareMessage('Your library was cleared.');
  };

  return (
    <main className="min-h-screen bg-[#080b10] px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {history.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Pick up where you left off</p>
                <h2 className="text-2xl font-semibold text-white">Continue watching</h2>
              </div>
              <span className="text-xs text-gray-500">{history.length} recent</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.slice(0, 3).map((entry) => {
                const href = entry.type === 'movie'
                  ? `/movie/${entry.id}`
                  : `/tv-shows/${entry.id}`;
                return (
                  <div key={`${entry.type}-${entry.id}`} className="flex gap-4 rounded-xl border border-white/10 bg-[#0d131c] p-3">
                    <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md bg-[#121923]">
                      {entry.posterPath && (
                        <Image src={`https://image.tmdb.org/t/p/w185${entry.posterPath}`} alt={entry.title} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{entry.title}</p>
                      <p className="mt-1 truncate text-xs text-gray-400">
                        {entry.type === 'tv' && entry.season && entry.episode
                          ? `S${entry.season} E${entry.episode} · ${entry.episodeTitle || 'Episode'}`
                          : 'Movie'}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Link href={href} className="inline-flex items-center gap-1.5 rounded-md bg-cyan-300 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-200">
                          <PlayIcon className="h-3.5 w-3.5" /> Resume
                        </Link>
                        <button type="button" onClick={() => removeHistoryItem(entry)} aria-label={`Remove ${entry.title} from history`} className="rounded-md p-1.5 text-gray-500 hover:bg-white/10 hover:text-white">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Your space</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">My Library</h1>
            <p className="mt-3 max-w-xl text-gray-400">Keep the stories you want to come back to in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={shareLibrary}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Share
            </button>
            <button
              type="button"
              onClick={clearLibrary}
              disabled={items.length === 0 && history.length === 0}
              className="rounded-md border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear all
            </button>
            {(['all', 'movie', 'tv'] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  filter === value
                    ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {value === 'all' ? 'All' : value === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>
        </header>
        {shareMessage && (
          <p role="status" className="mb-6 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-200">
            {shareMessage}
          </p>
        )}

        {visibleItems.length === 0 ? (
          <section className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <BookmarkIcon className="mx-auto h-10 w-10 text-cyan-300/70" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              {items.length === 0 ? 'Your library is waiting' : 'Nothing in this filter yet'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              {items.length === 0
                ? 'Use Save on any movie or show page and it will appear here.'
                : 'Try another filter or browse the catalog for something new.'}
            </p>
            <Link href="/movies" className="mt-6 inline-flex rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              Browse movies
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {visibleItems.map((item) => {
              const href = item.type === 'movie' ? `/movie/${item.id}` : `/tv-shows/${item.id}`;
              return (
                <article key={`${item.type}-${item.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#121923]">
                    {item.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">No poster</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
                      <Link href={href} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-200">
                        <PlayIcon className="h-3.5 w-3.5" />
                        Watch
                      </Link>
                      <button type="button" onClick={() => removeItem(item)} aria-label={`Remove ${item.title}`} className="rounded-md border border-white/20 bg-black/50 p-2 text-gray-300 hover:bg-red-500/80 hover:text-white">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">{item.type === 'movie' ? 'Movie' : 'TV show'}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
