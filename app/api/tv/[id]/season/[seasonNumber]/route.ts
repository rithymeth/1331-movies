import { NextResponse } from 'next/server';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: { id: string; seasonNumber: string } }
) {
  const { id, seasonNumber } = params;

  try {
    const response = await fetchTmdb(`/tv/${id}/season/${seasonNumber}`);
    if (!response) {
      throw new Error('Failed to fetch season data');
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch season data' },
      { status: 500 }
    );
  }
}
