import Link from 'next/link';

export default function GenreFilterBar({
  genres,
  selected,
  basePath
}: {
  genres: { id: number; name: string }[];
  selected?: string;
  basePath: string;
}) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href={basePath}
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
          !selected ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
        }`}
      >
        All
      </Link>
      {genres.map((genre) => {
        const active = selected === String(genre.id);
        return (
          <Link
            key={genre.id}
            href={`${basePath}?genre=${genre.id}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
              active ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {genre.name}
          </Link>
        );
      })}
    </div>
  );
}
