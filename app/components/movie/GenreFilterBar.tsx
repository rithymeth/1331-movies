import Link from 'next/link';
import { CatalogQuery, catalogHref } from '@/app/lib/catalogQuery';

export default function GenreFilterBar({
  genres,
  query,
  basePath
}: {
  genres: { id: number; name: string }[];
  query: CatalogQuery;
  basePath: string;
}) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href={catalogHref(basePath, { ...query, genre: undefined, page: 1 })}
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
          !query.genre ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
        }`}
      >
        All
      </Link>
      {genres.map((genre) => {
        const active = query.genre === String(genre.id);
        return (
          <Link
            key={genre.id}
            href={catalogHref(basePath, { ...query, genre: String(genre.id), page: 1 })}
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
