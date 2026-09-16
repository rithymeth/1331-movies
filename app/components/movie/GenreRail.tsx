import Link from 'next/link';

export default function GenreRail({
  genres,
  title = 'Genres',
  eyebrow = 'Browse by mood',
  hrefBase = '/movies'
}: {
  genres: { id: number; name: string }[];
  title?: string;
  eyebrow?: string;
  hrefBase?: string;
}) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
        <Link href={hrefBase} className="text-xs font-medium text-slate-500 hover:text-white">
          View catalog
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {genres.slice(0, 16).map((genre) => (
          <Link
            key={genre.id}
            href={`${hrefBase}?genre=${genre.id}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
