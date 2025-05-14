import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = process.env.TMDB_API_KEY;

    // Fetch TV shows
    let url = `${baseUrl}/search/tv?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
    if (genre) {
      url += `&with_genres=${genre}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.status_message || 'Failed to fetch TV shows');
    }

    let results = data.results;

    // Apply sorting
    if (sort) {
      results = results.sort((a: any, b: any) => {
        switch (sort) {
          case 'popularity.desc':
            return b.popularity - a.popularity;
          case 'rating.desc':
            return b.vote_average - a.vote_average;
          case 'date.desc':
            return new Date(b.first_air_date || '').getTime() - new Date(a.first_air_date || '').getTime();
          default:
            return 0;
        }
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return NextResponse.json({ error: 'Failed to search TV shows' }, { status: 500 });
  }
}
