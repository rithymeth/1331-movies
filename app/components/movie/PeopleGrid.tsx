import Image from 'next/image';
import Link from 'next/link';
import { getTmdbImageUrl } from '@/app/lib/tmdb';

export default function PeopleGrid({
  people
}: {
  people: { id: number; name: string; profile_path: string | null; known_for_department?: string }[];
}) {
  if (people.length === 0) {
    return <p className="text-sm text-slate-500">No people found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {people.map((person) => (
        <Link key={person.id} href={`/person/${person.id}`} className="group text-center">
          <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#121923]">
            {person.profile_path ? (
              <Image
                src={getTmdbImageUrl(person.profile_path, 'w185') || ''}
                alt={person.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
          <p className="truncate font-semibold text-white">{person.name}</p>
          {person.known_for_department ? <p className="mt-1 truncate text-xs text-slate-500">{person.known_for_department}</p> : null}
        </Link>
      ))}
    </div>
  );
}
