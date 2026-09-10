export const DEFAULT_SITE_URL = 'https://1331-movies.netlify.app';

export const siteConfig = {
  name: '1331 Movies',
  description:
    'Watch the latest movies and TV shows online for free in HD quality. Stream unlimited movies, series, and entertainment without subscription.',
  keywords:
    'movies online, free movies, watch movies online, tv shows online, streaming movies, latest movies, HD movies',
  ogImage: '/og-image.jpg'
};

export function getBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  return (configuredUrl || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${getBaseUrl()}/`).toString();
}
