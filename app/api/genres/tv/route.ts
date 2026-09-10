import { NextResponse } from 'next/server';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function GET() {
  try {
    const data = await fetchTmdb<{ genres?: { id: number; name: string }[] }>('/genre/tv/list', {
      revalidate: 86400
    });
    return NextResponse.json(data?.genres || []);
  } catch (error) {
    console.error('Error fetching TV show genres:', error);
    return NextResponse.json({ error: 'Failed to fetch TV show genres' }, { status: 500 });
  }
}
