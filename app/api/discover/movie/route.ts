import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'popularity.desc';

  try {
    let url = 'https://api.themoviedb.org/3/discover/movie?';
    const params = new URLSearchParams({
      api_key: process.env.TMDB_API_KEY || '',
      language: 'en-US',
      sort_by: sort,
      include_adult: 'false',
      include_video: 'false',
      page: '1',
      with_genres: genre
    });

    const response = await fetch(url + params.toString());
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
