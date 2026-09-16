import Image from 'next/image';
import type { Metadata } from 'next';
import MediaGrid from '@/app/components/movie/MediaGrid';
import CatalogPager from '@/app/components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdb, fetchTmdbPage, getTmdbImageUrl, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

interface Company {
  id: number;
  name: string;
  description: string | null;
  headquarters: string | null;
  homepage: string | null;
  origin_country: string | null;
  logo_path: string | null;
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const company = await fetchTmdb<Company>(`/company/${params.id}`);
  return {
    title: company ? `${company.name} | 1331 Movies` : 'Company | 1331 Movies',
    description: company?.description?.slice(0, 160) || 'Studio titles from TMDB.'
  };
}

export default async function CompanyPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const page = clampTmdbPage(searchParams?.page);
  const [company, catalog] = await Promise.all([
    fetchTmdb<Company>(`/company/${params.id}`),
    fetchTmdbPage<TmdbMediaListItem>('/discover/movie', {
      params: {
        with_companies: params.id,
        sort_by: 'popularity.desc',
        include_adult: 'false',
        page
      }
    })
  ]);

  if (!company) {
    return <main className="min-h-screen bg-[#080b10] px-4 pt-28 text-center text-white"><h1 className="text-3xl font-bold">Company not found</h1></main>;
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 pb-16 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-start gap-5">
          {company.logo_path ? (
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-white p-2">
              <Image src={getTmdbImageUrl(company.logo_path, 'w185') || ''} alt="" fill className="object-contain" />
            </div>
          ) : null}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Studio</p>
            <h1 className="text-4xl font-black text-white sm:text-6xl">{company.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{company.description || [company.headquarters, company.origin_country].filter(Boolean).join(' · ') || 'Movies from this production company.'}</p>
          </div>
        </div>
        <MediaGrid items={mapTmdbMediaCollection(catalog.results, 'movie')} emptyTitle="No titles found" emptyMessage="TMDB did not return movies for this company." />
        <CatalogPager basePath={`/company/${params.id}`} query={{ page }} page={catalog.page} totalPages={catalog.totalPages} />
      </div>
    </main>
  );
}
