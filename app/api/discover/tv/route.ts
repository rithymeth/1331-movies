import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'popularity.desc';

  try {
    let url = 'https://api.themoviedb.org/3/discover/tv?';
    const params = new URLSearchParams({
      api_key: process.env.TMDB_API_KEY || '',
      language: 'en-US',
      sort_by: sort,
      include_adult: 'false',
      page: '1',
      with_genres: genre
    });

    const response = await fetch(url + params.toString());
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 });
  }
}
