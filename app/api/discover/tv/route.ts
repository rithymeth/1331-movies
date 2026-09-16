import { NextResponse } from 'next/server';
import { parseCatalogYear } from '@/app/lib/catalogQuery';
import { clampTmdbPage, fetchTmdbPage, MediaSort, sortTmdbMediaResults, TmdbMediaListItem } from '@/app/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || '';
  const sort = (searchParams.get('sort') as MediaSort | null) || 'popularity.desc';
  const year = parseCatalogYear(searchParams.get('year') || undefined);
  const page = clampTmdbPage(searchParams.get('page'));

  try {
    const data = await fetchTmdbPage<TmdbMediaListItem>('/discover/tv', {
      params: {
        sort_by: sort === 'rating.desc' ? 'vote_average.desc' : sort === 'date.desc' ? 'first_air_date.desc' : 'popularity.desc',
        include_adult: 'false',
        with_genres: genre,
        first_air_date_year: year,
        'vote_count.gte': sort === 'rating.desc' ? 80 : undefined,
        page
      }
    });

    return NextResponse.json({
      results: sortTmdbMediaResults(data.results, sort),
      page: data.page,
      total_pages: data.totalPages
    });
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 });
  }
}
