'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTmdbImageUrl } from '@/app/lib/tmdb';

export default function ImageGallery({
  title = 'Photos',
  images
}: {
  title?: string;
  images: { file_path: string }[];
}) {
  const photos = images.slice(0, 10);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((current) => (current === null ? 0 : (current + 1) % photos.length));
      if (event.key === 'ArrowLeft') setActive((current) => (current === null ? 0 : (current - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {photos.map((image, index) => (
          <button
            key={image.file_path}
            type="button"
            onClick={() => setActive(index)}
            className="relative h-36 w-64 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121923] sm:h-44 sm:w-80"
          >
            <Image src={getTmdbImageUrl(image.file_path, 'w780') || ''} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
      {active !== null ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4" onClick={() => setActive(null)}>
          <div className="relative h-[70vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image src={getTmdbImageUrl(photos[active].file_path, 'original') || ''} alt="" fill className="object-contain" />
            <button type="button" onClick={() => setActive(null)} className="absolute right-0 top-0 rounded-md bg-white/10 px-3 py-1 text-sm text-white">Close</button>
            {photos.length > 1 ? (
              <>
                <button type="button" onClick={() => setActive((active - 1 + photos.length) % photos.length)} className="absolute left-0 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white">Prev</button>
                <button type="button" onClick={() => setActive((active + 1) % photos.length)} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white">Next</button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
