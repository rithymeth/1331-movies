import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = process.env.TMDB_API_KEY;

    const res = await fetch(
      `${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.status_message || 'Failed to fetch movie genres');
    }

    return NextResponse.json(data.genres);
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    return NextResponse.json({ error: 'Failed to fetch movie genres' }, { status: 500 });
  }
}
