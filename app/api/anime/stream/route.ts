import { NextResponse } from 'next/server';

const ANILIST_API = 'https://graphql.anilist.co';

async function getAnimeDetails(title: string) {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        episodes
      }
    }
  `;

  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { search: title }
    }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch anime details');
  }

  const data = await response.json();
  return data.data?.Media;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const episode = searchParams.get('episode');
    const type = searchParams.get('type') || 'sub';

    if (!title || !episode) {
      return NextResponse.json({ error: 'Title and episode are required' }, { status: 400 });
    }

    // Get anime details from AniList
    const animeDetails = await getAnimeDetails(title);
    
    if (!animeDetails) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }

    if (!animeDetails.idMal) {
      return NextResponse.json({ error: 'MAL ID not found' }, { status: 404 });
    }

    // Validate episode number
    const episodeNum = parseInt(episode);
    if (animeDetails.episodes && episodeNum > animeDetails.episodes) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    // Generate vidsrc.cc embed URL
    const embedUrl = `https://vidsrc.cc/v2/embed/anime/${animeDetails.idMal}/${episodeNum}/${type}`;

    return NextResponse.json({
      embedUrl,
      title: animeDetails.title,
      totalEpisodes: animeDetails.episodes,
      currentEpisode: episodeNum
    });
  } catch (error) {
    console.error('Error fetching stream:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get streaming data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
