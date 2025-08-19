import { NextResponse } from 'next/server';

const JIKAN_API = 'https://api.jikan.moe/v4';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Anime ID is required' }, { status: 400 });
    }

    // Fetch anime details from Jikan API
    const response = await fetch(`${JIKAN_API}/anime/${id}/full`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
      }
      throw new Error(`Jikan API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }

    // Transform the response to match our expected format
    const anime = data.data;
    const transformedAnime = {
      mal_id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      synopsis: anime.synopsis,
      images: {
        jpg: {
          image_url: anime.images?.jpg?.image_url,
          large_image_url: anime.images?.jpg?.large_image_url,
        },
        webp: {
          image_url: anime.images?.webp?.image_url,
          large_image_url: anime.images?.webp?.large_image_url,
        }
      },
      episodes: anime.episodes,
      status: anime.status,
      score: anime.score,
      scored_by: anime.scored_by,
      genres: anime.genres?.map((genre: any) => ({
        mal_id: genre.mal_id,
        name: genre.name
      })) || [],
      studios: anime.studios?.map((studio: any) => ({
        mal_id: studio.mal_id,
        name: studio.name
      })) || [],
      external: anime.external?.map((ext: any) => ({
        name: ext.name,
        url: ext.url
      })) || [],
      streaming: anime.streaming?.map((stream: any) => ({
        name: stream.name,
        url: stream.url
      })) || [],
      // Additional fields that might be useful
      type: anime.type,
      source: anime.source,
      duration: anime.duration,
      rating: anime.rating,
      year: anime.year,
      season: anime.season,
      broadcast: anime.broadcast,
      producers: anime.producers?.map((producer: any) => ({
        mal_id: producer.mal_id,
        name: producer.name
      })) || [],
      licensors: anime.licensors?.map((licensor: any) => ({
        mal_id: licensor.mal_id,
        name: licensor.name
      })) || [],
      themes: anime.themes?.map((theme: any) => ({
        mal_id: theme.mal_id,
        name: theme.name
      })) || [],
      demographics: anime.demographics?.map((demo: any) => ({
        mal_id: demo.mal_id,
        name: demo.name
      })) || []
    };

    return NextResponse.json(transformedAnime);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch anime details', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
