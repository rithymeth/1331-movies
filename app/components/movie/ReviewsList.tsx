export default function ReviewsList({
  reviews
}: {
  reviews: { id: string; author: string; content: string; created_at?: string }[];
}) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Reviews</h2>
      <div className="space-y-4">
        {reviews.slice(0, 4).map((review) => (
          <article key={review.id} className="rounded-xl border border-white/10 bg-[#0d131c] p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{review.author}</p>
              {review.created_at ? <p className="text-xs text-slate-500">{review.created_at.slice(0, 10)}</p> : null}
            </div>
            <p className="text-sm leading-6 text-slate-300">{review.content.slice(0, 420)}{review.content.length > 420 ? '...' : ''}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
