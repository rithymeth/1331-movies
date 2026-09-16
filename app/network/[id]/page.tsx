import Image from 'next/image';
import type { Metadata } from 'next';
import MediaGrid from '@/app/components/movie/MediaGrid';
import CatalogPager from '@/app/components/movie/CatalogPager';
import { clampTmdbPage, fetchTmdb, fetchTmdbPage, getTmdbImageUrl, TmdbMediaListItem } from '@/app/lib/tmdb';
import { mapTmdbMediaCollection } from '@/app/lib/media';

interface Network {
  id: number;
  name: string;
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
  const network = await fetchTmdb<Network>(`/network/${params.id}`);
  return {
    title: network ? `${network.name} | 1331 Movies` : 'Network | 1331 Movies',
    description: `Series from ${network?.name || 'this network'}.`
  };
}

export default async function NetworkPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const page = clampTmdbPage(searchParams?.page);
  const [network, catalog] = await Promise.all([
    fetchTmdb<Network>(`/network/${params.id}`),
    fetchTmdbPage<TmdbMediaListItem>('/discover/tv', {
      params: {
        with_networks: params.id,
        sort_by: 'popularity.desc',
        include_adult: 'false',
        page
      }
    })
  ]);

  if (!network) {
    return <main className="min-h-screen bg-[#080b10] px-4 pt-28 text-center text-white"><h1 className="text-3xl font-bold">Network not found</h1></main>;
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 pb-16 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-start gap-5">
          {network.logo_path ? (
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-white p-2">
              <Image src={getTmdbImageUrl(network.logo_path, 'w185') || ''} alt="" fill className="object-contain" />
            </div>
          ) : null}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Network</p>
            <h1 className="text-4xl font-black text-white sm:text-6xl">{network.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{[network.headquarters, network.origin_country].filter(Boolean).join(' · ') || 'Series from this TV network.'}</p>
          </div>
        </div>
        <MediaGrid items={mapTmdbMediaCollection(catalog.results, 'tv')} emptyTitle="No series found" emptyMessage="TMDB did not return shows for this network." />
        <CatalogPager basePath={`/network/${params.id}`} query={{ page }} page={catalog.page} totalPages={catalog.totalPages} />
      </div>
    </main>
  );
}
