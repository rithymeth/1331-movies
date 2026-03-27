import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1&region=US`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      console.error('Failed to fetch upcoming movies:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch upcoming movies' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}