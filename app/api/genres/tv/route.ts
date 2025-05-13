import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = process.env.TMDB_API_KEY;

    const res = await fetch(
      `${baseUrl}/genre/tv/list?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.status_message || 'Failed to fetch TV show genres');
    }

    return NextResponse.json(data.genres);
  } catch (error) {
    console.error('Error fetching TV show genres:', error);
    return NextResponse.json({ error: 'Failed to fetch TV show genres' }, { status: 500 });
  }
}
