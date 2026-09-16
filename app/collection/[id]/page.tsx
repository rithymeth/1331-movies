import Image from 'next/image';
import type { Metadata } from 'next';
import MediaGrid from '@/app/components/movie/MediaGrid';
import { fetchTmdb, getTmdbImageUrl, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TmdbMediaListItem[];
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const collection = await fetchTmdb<Collection>(`/collection/${params.id}`);
  if (!collection) {
    return { title: 'Collection | 1331 Movies' };
  }
  return {
    title: `${collection.name} | 1331 Movies`,
    description: collection.overview?.slice(0, 160) || `Titles in the ${collection.name} collection.`
  };
}

export default async function CollectionPage({
  params
}: {
  params: { id: string };
}) {
  const collection = await fetchTmdb<Collection>(`/collection/${params.id}`);

  if (!collection) {
    return (
      <main className="min-h-screen bg-[#080b10] px-4 pt-28 text-center text-white">
        <h1 className="text-3xl font-bold">Collection not found</h1>
      </main>
    );
  }

  const parts = mapTmdbMediaCollection(collection.parts || [], 'movie').sort((a, b) => a.year.localeCompare(b.year));

  return (
    <main className="min-h-screen bg-[#080b10]">
      <div className="relative h-[320px] overflow-hidden sm:h-[420px]">
        {collection.backdrop_path ? (
          <Image src={getTmdbImageUrl(collection.backdrop_path, 'original') || ''} alt="" fill className="object-cover" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Collection</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">{collection.name}</h1>
            {collection.overview ? <p className="mt-3 max-w-2xl text-slate-300">{collection.overview}</p> : null}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <MediaGrid items={parts} emptyTitle="No titles in this collection" emptyMessage="TMDB did not return parts for this collection." />
      </div>
    </main>
  );
}
