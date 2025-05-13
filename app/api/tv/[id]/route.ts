import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Fetching TV show details for ID:', params.id);
  
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is not set');
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch TV show details
    console.log('Fetching main TV show data...');
    const tvResponse = await fetch(
      `${TMDB_BASE_URL}/tv/${params.id}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!tvResponse.ok) {
      const errorData = await tvResponse.json();
      console.error('TMDB API Error:', errorData);
      throw new Error(errorData.status_message || 'Failed to fetch TV show details');
    }

    const tvData = await tvResponse.json();
    console.log('TV show data fetched successfully');

    // Fetch season details for each season
    console.log('Fetching season details...');
    const seasonPromises = tvData.seasons.map(async (season: any) => {
      console.log(`Fetching details for season ${season.season_number}...`);
      try {
        const seasonResponse = await fetch(
          `${TMDB_BASE_URL}/tv/${params.id}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        
        if (!seasonResponse.ok) {
          console.error(`Failed to fetch season ${season.season_number}:`, await seasonResponse.text());
          return season;
        }

        const seasonData = await seasonResponse.json();
        console.log(`Season ${season.season_number} fetched successfully`);
        return {
          ...season,
          episodes: seasonData.episodes
        };
      } catch (error) {
        console.error(`Error fetching season ${season.season_number}:`, error);
        return season;
      }
    });

    const seasons = await Promise.all(seasonPromises);
    console.log('All season details fetched');

    const response = {
      ...tvData,
      seasons
    };

    console.log('Sending response with seasons:', seasons.length);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in TV show API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    );
  }
}
