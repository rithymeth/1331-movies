import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import MediaGrid from '@/app/components/movie/MediaGrid';
import { fetchTmdb, getTmdbImageUrl, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaToCard } from '@/app/lib/media';

interface Person {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string | null;
}

interface Credit extends TmdbMediaListItem {
  media_type?: 'movie' | 'tv';
  character?: string;
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const person = await fetchTmdb<Person>(`/person/${params.id}`);
  if (!person) {
    return { title: 'Person | 1331 Movies' };
  }
  return {
    title: `${person.name} | 1331 Movies`,
    description: person.biography?.slice(0, 160) || `Titles featuring ${person.name}.`
  };
}

export default async function PersonPage({
  params
}: {
  params: { id: string };
}) {
  const [person, credits] = await Promise.all([
    fetchTmdb<Person>(`/person/${params.id}`),
    fetchTmdb<{ cast?: Credit[] }>(`/person/${params.id}/combined_credits`)
  ]);

  if (!person) {
    return (
      <main className="min-h-screen bg-[#080b10] px-4 pt-28 text-center text-white">
        <h1 className="text-3xl font-bold">Person not found</h1>
        <Link href="/" className="mt-4 inline-block text-cyan-300">Back home</Link>
      </main>
    );
  }

  const knownFor = (credits?.cast || [])
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id && entry.media_type === item.media_type) === index)
    .slice(0, 18)
    .map((item) => mapTmdbMediaToCard(item, item.media_type === 'tv' ? 'tv' : 'movie'));

  return (
    <main className="min-h-screen bg-[#080b10] px-4 pb-16 pt-28 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#121923]">
          {person.profile_path ? (
            <Image src={getTmdbImageUrl(person.profile_path, 'w500') || ''} alt={person.name} fill className="object-cover" />
          ) : null}
        </div>
        <div className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{person.known_for_department || 'Cast'}</p>
          <h1 className="text-4xl font-black text-white sm:text-6xl">{person.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {person.birthday ? <span>Born {person.birthday}</span> : null}
            {person.place_of_birth ? <span>{person.place_of_birth}</span> : null}
          </div>
          {person.biography ? <p className="max-w-3xl whitespace-pre-line text-slate-300 leading-relaxed">{person.biography.slice(0, 900)}</p> : null}
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl space-y-6">
        <h2 className="text-2xl font-bold text-white">Known for</h2>
        <MediaGrid items={knownFor} emptyTitle="No catalog titles yet" emptyMessage="TMDB did not return credited movies or shows for this person." />
      </div>
    </main>
  );
}
