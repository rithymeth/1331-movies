import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeWindow = searchParams.get('time_window') || 'week';

  try {
    const url = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      console.error('Failed to fetch trending movies:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch trending movies' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}