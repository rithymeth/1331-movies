import Image from 'next/image';
import { getTmdbImageUrl, TmdbWatchProvider } from '@/app/lib/tmdb';

export default function WatchProviders({
  providers,
  tmdbUrl
}: {
  providers: TmdbWatchProvider[];
  tmdbUrl: string;
}) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Where to watch</h2>
        <a href={tmdbUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white">
          Data from TMDB
        </a>
      </div>
      <div className="flex flex-wrap gap-3">
        {providers.map((provider) => {
          const logo = getTmdbImageUrl(provider.logo_path, 'w92');
          return (
            <a
              key={provider.provider_id}
              href={tmdbUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:border-cyan-300/40"
            >
              {logo ? (
                <Image src={logo} alt="" width={24} height={24} className="h-6 w-6 rounded" />
              ) : null}
              {provider.provider_name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
