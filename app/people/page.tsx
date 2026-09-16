import Link from 'next/link';
import PeopleGrid from '../components/movie/PeopleGrid';
import CatalogPager from '../components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdbPage } from '@/app/lib/tmdb';

interface PersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}

export default async function PeoplePage({
  searchParams
}: {
  searchParams: { page?: string };
}) {
  const page = clampTmdbPage(searchParams?.page);
  const data = await fetchTmdbPage<PersonResult>('/person/popular', { params: { page } });

  return (
    <main className="min-h-screen bg-[#080b10] px-4 pb-16 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Catalog</p>
            <h1 className="text-5xl font-black text-white">People</h1>
            <p className="mt-3 max-w-xl text-slate-400">Popular actors and creators from TMDB. Open anyone to see the titles they are known for.</p>
          </div>
          <Link href="/search" className="text-sm text-slate-400 hover:text-white">Search people</Link>
        </div>
        <PeopleGrid people={data.results} />
        <CatalogPager basePath="/people" query={{ page }} page={data.page} totalPages={data.totalPages} />
      </div>
    </main>
  );
}
