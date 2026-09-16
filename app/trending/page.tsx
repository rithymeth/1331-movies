import Image from 'next/image';
import Link from 'next/link';
import MediaGrid from '../components/movie/MediaGrid';
import { fetchTmdbList, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

export default async function TrendingPage({
  searchParams
}: {
  searchParams: { type?: string };
}) {
  const type = searchParams?.type === 'tv' ? 'tv' : searchParams?.type === 'movie' ? 'movie' : 'all';
  const [movies, shows] = await Promise.all([
    fetchTmdbList<TmdbMediaListItem>('/trending/movie/week'),
    fetchTmdbList<TmdbMediaListItem>('/trending/tv/week')
  ]);
  const movieItems = mapTmdbMediaCollection(movies, 'movie');
  const tvItems = mapTmdbMediaCollection(shows, 'tv');
  const items = type === 'movie' ? movieItems : type === 'tv' ? tvItems : [...movieItems, ...tvItems].slice(0, 24);
  const hero = items[0];

  return (
    <div className="min-h-screen bg-[#080b10]">
      <div className="relative h-[320px] overflow-hidden sm:h-[420px]">
        {hero?.backdrop ? <Image src={hero.backdrop} alt="" fill className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/70 to-black/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">This week</p>
            <h1 className="text-5xl font-black text-white sm:text-7xl">Trending</h1>
            <p className="mt-3 max-w-xl text-slate-300">What people are looking at right now across movies and TV.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <div className="flex gap-2">
          {[
            { href: '/trending', label: 'All', active: type === 'all' },
            { href: '/trending?type=movie', label: 'Movies', active: type === 'movie' },
            { href: '/trending?type=tv', label: 'TV', active: type === 'tv' }
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                tab.active ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <MediaGrid items={items} emptyTitle="No trending titles" emptyMessage="The trending feed is empty right now." />
      </div>
    </div>
  );
}
