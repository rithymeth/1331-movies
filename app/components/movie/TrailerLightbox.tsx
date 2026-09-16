'use client';

import { useEffect, useState } from 'react';

interface Trailer {
  id: string;
  key: string;
  name: string;
}

export default function TrailerLightbox({ videos }: { videos: Trailer[] }) {
  const [active, setActive] = useState<Trailer | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Trailers & Clips</h2>
      <div className="grid gap-2">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video)}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white hover:border-cyan-300/40"
          >
            <span className="truncate">{video.name}</span>
            <span className="ml-3 shrink-0 text-xs text-cyan-300">Play</span>
          </button>
        ))}
      </div>
      {active ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-4xl space-y-3" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="truncate text-sm text-white">{active.name}</p>
              <button type="button" onClick={() => setActive(null)} className="rounded-md bg-white/10 px-3 py-1 text-sm text-white">Close</button>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${active.key}?autoplay=1&controls=1&modestbranding=1`}
                title={active.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
