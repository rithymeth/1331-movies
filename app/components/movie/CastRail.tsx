import Image from 'next/image';
import Link from 'next/link';
import { getTmdbImageUrl } from '@/app/lib/tmdb';

export default function CastRail({
  cast
}: {
  cast: { id: number; name: string; character?: string; profile_path: string | null }[];
}) {
  if (cast.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Cast</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {cast.slice(0, 12).map((member) => (
          <Link key={member.id} href={`/person/${member.id}`} className="text-center hover:opacity-90">
            <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-[#121923]">
              {member.profile_path ? (
                <Image src={getTmdbImageUrl(member.profile_path, 'w185') || ''} alt={member.name} fill className="object-cover" />
              ) : null}
            </div>
            <p className="truncate font-semibold text-white">{member.name}</p>
            {member.character ? <p className="mt-1 truncate text-sm text-slate-400">{member.character}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
