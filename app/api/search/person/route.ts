import { NextResponse } from 'next/server';
import { clampTmdbPage, fetchTmdbPage } from '@/app/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = clampTmdbPage(searchParams.get('page'));

  if (!query) {
    return NextResponse.json({ results: [], page: 1, total_pages: 1 });
  }

  try {
    const data = await fetchTmdbPage<{ id: number; name: string; profile_path: string | null; known_for_department?: string }>(
      '/search/person',
      { params: { query, page } }
    );
    return NextResponse.json({
      results: data.results,
      page: data.page,
      total_pages: data.totalPages
    });
  } catch (error) {
    console.error('Error searching people:', error);
    return NextResponse.json({ error: 'Failed to search people' }, { status: 500 });
  }
}
