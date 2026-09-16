import { NextResponse } from 'next/server';
import { clampTmdbPage, fetchTmdbPage, MediaSort, sortTmdbMediaResults, TmdbMediaListItem } from '@/app/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const sort = (searchParams.get('sort') as MediaSort | null) || 'popularity.desc';
  const page = clampTmdbPage(searchParams.get('page'));

  if (!query) {
    return NextResponse.json({ results: [], page: 1, total_pages: 1 });
  }

  try {
    const data = await fetchTmdbPage<TmdbMediaListItem>('/search/movie', {
      params: {
        query,
        with_genres: genre || undefined,
        page
      }
    });

    return NextResponse.json({
      results: sortTmdbMediaResults(data.results, sort),
      page: data.page,
      total_pages: data.totalPages
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 });
  }
}
