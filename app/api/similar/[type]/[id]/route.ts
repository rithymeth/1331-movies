import { NextResponse } from 'next/server';
import { fetchTmdbList, TmdbMediaListItem } from '@/app/lib/tmdb';

export async function GET(
  _request: Request,
  { params }: { params: { type: string; id: string } }
) {
  const mediaType = params.type === 'tv' ? 'tv' : params.type === 'movie' ? 'movie' : null;
  const id = Number(params.id);

  if (!mediaType || !Number.isFinite(id)) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }

  try {
    const recommended = await fetchTmdbList<TmdbMediaListItem>(`/${mediaType}/${id}/recommendations`);
    const similar = recommended.length > 0
      ? recommended
      : await fetchTmdbList<TmdbMediaListItem>(`/${mediaType}/${id}/similar`);

    return NextResponse.json({
      results: similar,
      mediaType
    });
  } catch (error) {
    console.error('Error fetching similar titles:', error);
    return NextResponse.json({ error: 'Failed to fetch similar titles' }, { status: 500 });
  }
}
