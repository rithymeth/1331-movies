import Link from 'next/link';

export default function CatalogPager({
  basePath,
  genre,
  page,
  totalPages
}: {
  basePath: string;
  genre?: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (nextPage > 1) params.set('page', String(nextPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
          Previous
        </Link>
      ) : null}
      <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
          Next
        </Link>
      ) : null}
    </div>
  );
}
