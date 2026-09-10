import { NextResponse } from 'next/server';
import { fetchTmdbList, MediaSort, sortTmdbMediaResults, TmdbMediaListItem } from '@/app/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const sort = (searchParams.get('sort') as MediaSort | null) || 'popularity.desc';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await fetchTmdbList<TmdbMediaListItem>('/search/tv', {
      params: {
        query,
        with_genres: genre || undefined
      }
    });

    return NextResponse.json({ results: sortTmdbMediaResults(results, sort) });
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return NextResponse.json({ error: 'Failed to search TV shows' }, { status: 500 });
  }
}
