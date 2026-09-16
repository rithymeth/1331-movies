import Link from 'next/link';

export default function LinkChips({
  title,
  items
}: {
  title: string;
  items: { id: number; name: string; href: string }[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 12).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-300/40 hover:text-white"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
