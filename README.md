# 1331 Movies

Next.js catalog for movies, TV shows, and anime, powered by [TMDB](https://www.themoviedb.org/).

Live site: https://1331-movies.netlify.app

## Setup

```bash
cp .env.example .env.local
```

Required environment variables:

- `TMDB_API_KEY` — API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
- `NEXT_PUBLIC_BASE_URL` — public site URL, for example `https://1331-movies.netlify.app`

```bash
npm install
npm run dev
```

The app runs on the custom Node server in `server.js` so watch-together sockets work locally.

## Scripts

- `npm run dev` — local server
- `npm run build` — production Next.js build
- `npm start` — production server
- `npm run lint` — ESLint

## Notes

This project is a TMDB-backed discovery UI. Title metadata, posters, ratings, trailers, and watch-provider data come from TMDB. Official trailers are embedded from YouTube when TMDB lists them.
