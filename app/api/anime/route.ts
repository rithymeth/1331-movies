import { NextResponse } from 'next/server';

const ANILIST_API = 'https://graphql.anilist.co';
const API_KEY = 'gecoluM6gEqOS8wXCZJsPVnUF4Rsd5eKUmRYXiTx';

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { query, variables } = body;

    // If no query is provided, use a default query for trending anime
    if (!query) {
      query = `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
              id
              idMal
              title {
                romaji
                english
                native
              }
              coverImage {
                large
                extraLarge
              }
              bannerImage
              description
              episodes
              status
              averageScore
              genres
              nextAiringEpisode {
                episode
                timeUntilAiring
              }
            }
          }
        }
      `;
    }

    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    if (!response.ok) {
      throw new Error(`AniList API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to include streaming URLs
    if (data.data?.Media) {
      const anime = data.data.Media;
      anime.streamingUrl = `https://aniwave.to/watch/${anime.id}`;
    } else if (data.data?.Page?.media) {
      data.data.Page.media = data.data.Page.media.map((anime: any) => ({
        ...anime,
        streamingUrl: `https://aniwave.to/watch/${anime.id}`
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from AniList:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch anime data', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
