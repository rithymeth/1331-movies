export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080b10] px-4 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-10">
        <div className="h-[320px] rounded-2xl bg-white/5 md:h-[420px]" />
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-white/10" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[300px] w-[200px] shrink-0 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
