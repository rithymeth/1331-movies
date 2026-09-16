import Link from 'next/link';
import { CatalogQuery, catalogHref } from '@/app/lib/catalogQuery';

export default function CatalogPager({
  basePath,
  query,
  page,
  totalPages
}: {
  basePath: string;
  query: CatalogQuery;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {page > 1 ? (
        <Link href={catalogHref(basePath, { ...query, page: page - 1 })} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
          Previous
        </Link>
      ) : null}
      <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={catalogHref(basePath, { ...query, page: page + 1 })} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
          Next
        </Link>
      ) : null}
    </div>
  );
}
