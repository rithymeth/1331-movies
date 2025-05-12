import { NextResponse } from 'next/server';

const ANILIST_API = 'https://graphql.anilist.co';
const JIKAN_API = 'https://api.jikan.moe/v4';

interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

interface AnimeDetails {
  id?: number;
  idMal?: number;
  title?: AnimeTitle;
  episodes?: number;
}

async function searchJikan(title: string): Promise<number | null> {
  try {
    const response = await fetch(
      `${JIKAN_API}/anime?q=${encodeURIComponent(title)}&limit=1`,
      { cache: 'no-store' }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.data?.[0]?.mal_id || null;
  } catch {
    return null;
  }
}

async function getAnimeDetails(title: string): Promise<AnimeDetails | null> {
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
        synonyms
      }
    }
  `;

  try {
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

    if (!response.ok) return null;

    const data = await response.json();
    return data.data?.Media || null;
  } catch {
    return null;
  }
}

async function tryGetMalId(title: string, animeDetails: AnimeDetails | null): Promise<number | null> {
  // First try from AniList details
  if (animeDetails?.idMal) {
    return animeDetails.idMal;
  }

  // Try searching with different title variations
  const titleVariations = [
    title,
    animeDetails?.title?.english,
    animeDetails?.title?.romaji,
    animeDetails?.title?.native
  ].filter(Boolean) as string[];

  for (const titleVariation of titleVariations) {
    const malId = await searchJikan(titleVariation);
    if (malId) return malId;
  }

  return null;
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

    // Get anime details and try to find MAL ID
    const animeDetails = await getAnimeDetails(title);
    const malId = await tryGetMalId(title, animeDetails);

    if (!malId) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }

    // Validate episode number
    const episodeNum = parseInt(episode);
    if (animeDetails?.episodes && episodeNum > animeDetails.episodes) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    // Generate embed URLs for different providers as fallbacks
    const embedUrls = [
      `https://vidsrc.cc/v2/embed/anime/${malId}/${episodeNum}/${type}`,
      `https://vidsrc.to/embed/anime/${malId}/${episodeNum}`,
      `https://rapid-cloud.co/embed-6/anime?id=${malId}&episode=${episodeNum}`,
      `https://anihdplay.com/streaming.php?id=${malId}&ep=${episodeNum}`,
      `https://gogoplay.io/streaming.php?id=${malId}&ep=${episodeNum}`,
      `https://animixplay.to/v1/${malId}/${episodeNum}`,
    ];

    // Add dub-specific sources if dub is requested
    if (type === 'dub') {
      embedUrls.push(
        `https://animedub.tv/embed/${malId}/${episodeNum}`,
        `https://dubhappy.net/embed/${malId}/${episodeNum}`
      );
    }

    return NextResponse.json({
      embedUrl: embedUrls[0], // Primary source
      fallbackUrls: embedUrls.slice(1), // Backup sources
      title: animeDetails?.title || { romaji: title },
      totalEpisodes: animeDetails?.episodes,
      currentEpisode: episodeNum,
      malId
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
