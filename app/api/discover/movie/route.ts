import { NextResponse } from 'next/server';
import { fetchTmdbList, MediaSort, sortTmdbMediaResults, TmdbMediaListItem } from '@/app/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || '';
  const sort = (searchParams.get('sort') as MediaSort | null) || 'popularity.desc';

  try {
    const results = await fetchTmdbList<TmdbMediaListItem>('/discover/movie', {
      params: {
        sort_by: sort,
        include_adult: 'false',
        include_video: 'false',
        with_genres: genre
      }
    });

    return NextResponse.json({ results: sortTmdbMediaResults(results, sort) });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
