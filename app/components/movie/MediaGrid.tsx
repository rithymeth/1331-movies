'use client';

import { MediaCardItem } from '@/app/lib/media';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import EmptyState from '@/app/components/ui/EmptyState';

interface MediaGridProps {
  items: MediaCardItem[];
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function MediaGrid({
  items,
  emptyTitle = 'Nothing here yet',
  emptyMessage = 'Try another filter or come back again soon.'
}: MediaGridProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} compact />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item, index) => (
        <div
          key={`${item.mediaType}-${item.id}`}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {item.mediaType === 'movie' ? (
            <MovieCard
              id={item.id}
              title={item.title}
              poster={item.poster}
              year={item.year}
              rating={item.rating}
              voteCount={item.voteCount}
              overview={item.overview}
            />
          ) : (
            <TVShowCard
              id={item.id}
              name={item.title}
              poster={item.poster}
              year={item.year}
              rating={item.rating}
              voteCount={item.voteCount}
              overview={item.overview}
            />
          )}
        </div>
      ))}
    </div>
  );
}
