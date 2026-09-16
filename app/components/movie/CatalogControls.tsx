import Link from 'next/link';
import { CatalogQuery, CatalogSort, catalogCountries, catalogHref, catalogLanguages, catalogYearOptions } from '@/app/lib/catalogQuery';

const sorts: { value: CatalogSort; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'date', label: 'Newest' }
];

export default function CatalogControls({
  basePath,
  query
}: {
  basePath: string;
  query: CatalogQuery;
}) {
  const years = catalogYearOptions();

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {sorts.map((sort) => (
            <Link
              key={sort.value}
              href={catalogHref(basePath, { ...query, sort: sort.value, page: 1 })}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                (query.sort || 'popular') === sort.value
                  ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {sort.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link href={catalogHref(basePath, { ...query, year: undefined, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${!query.year ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>Any year</Link>
          {years.map((year) => (
            <Link key={year} href={catalogHref(basePath, { ...query, year, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${query.year === year ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300'}`}>
              {year}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link href={catalogHref(basePath, { ...query, country: undefined, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${!query.country ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>Any country</Link>
        {catalogCountries.map((country) => (
          <Link key={country.code} href={catalogHref(basePath, { ...query, country: country.code, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${query.country === country.code ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300'}`}>
            {country.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link href={catalogHref(basePath, { ...query, language: undefined, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${!query.language ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>Any language</Link>
        {catalogLanguages.map((language) => (
          <Link key={language.code} href={catalogHref(basePath, { ...query, language: language.code, page: 1 })} className={`shrink-0 rounded-full border px-3 py-2 text-sm ${query.language === language.code ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300'}`}>
            {language.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
