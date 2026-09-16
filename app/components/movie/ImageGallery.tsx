import Image from 'next/image';
import { getTmdbImageUrl } from '@/app/lib/tmdb';

export default function ImageGallery({
  title = 'Photos',
  images
}: {
  title?: string;
  images: { file_path: string }[];
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.slice(0, 10).map((image) => (
          <div key={image.file_path} className="relative h-36 w-64 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121923] sm:h-44 sm:w-80">
            <Image src={getTmdbImageUrl(image.file_path, 'w780') || ''} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
