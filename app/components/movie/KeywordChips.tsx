import Link from 'next/link';

export default function KeywordChips({
  keywords
}: {
  keywords: { id: number; name: string }[];
}) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-white">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0, 16).map((keyword) => (
          <Link
            key={keyword.id}
            href={`/search?q=${encodeURIComponent(keyword.name)}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-300/40 hover:text-white"
          >
            {keyword.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
