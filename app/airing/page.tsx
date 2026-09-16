import Image from 'next/image';
import MediaGrid from '../components/movie/MediaGrid';
import { fetchTmdbList, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

export default async function AiringPage() {
  const [today, onAir] = await Promise.all([
    fetchTmdbList<TmdbMediaListItem>('/tv/airing_today'),
    fetchTmdbList<TmdbMediaListItem>('/tv/on_the_air')
  ]);
  const todayItems = mapTmdbMediaCollection(today, 'tv');
  const weekItems = mapTmdbMediaCollection(onAir, 'tv');
  const hero = todayItems[0] || weekItems[0];

  return (
    <div className="min-h-screen bg-[#080b10]">
      <div className="relative h-[320px] overflow-hidden sm:h-[420px]">
        {hero?.backdrop ? <Image src={hero.backdrop} alt="" fill className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Schedule</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">Airing now</h1>
            <p className="mt-3 max-w-xl text-slate-300">Series with episodes out today and titles currently on the air.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Airing today</h2>
          <MediaGrid items={todayItems} emptyTitle="Nothing airing today" emptyMessage="TMDB did not return series airing today." />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">On the air</h2>
          <MediaGrid items={weekItems} emptyTitle="No series on the air" emptyMessage="Currently airing titles will appear here." />
        </section>
      </div>
    </div>
  );
}
