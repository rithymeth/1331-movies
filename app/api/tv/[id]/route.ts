import { NextResponse } from 'next/server';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tvData = await fetchTmdb<any>(`/tv/${params.id}`);
    if (!tvData) {
      throw new Error('Failed to fetch TV show details');
    }

    const seasonPromises = (tvData.seasons || []).map(async (season: any) => {
      try {
        const seasonData = await fetchTmdb<{ episodes?: any[] }>(
          `/tv/${params.id}/season/${season.season_number}`
        );

        return {
          ...season,
          episodes: seasonData?.episodes || []
        };
      } catch (error) {
        return season;
      }
    });

    const seasons = await Promise.all(seasonPromises);

    return NextResponse.json({
      ...tvData,
      seasons
    });
  } catch (error) {
    console.error('Error in TV show API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    );
  }
}
