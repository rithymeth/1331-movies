import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string; seasonNumber: string } }
) {
  const { id, seasonNumber } = params;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch season data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch season data' },
      { status: 500 }
    );
  }
}
