import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://1331-movies-kh.com'}${request.nextUrl.pathname}`;

  // Add canonical URL header
  requestHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);

  // Add X-Robots-Tag header
  requestHeaders.set('X-Robots-Tag', 'index, follow');

  // If accessing from Netlify subdomain, redirect to custom domain
  if (request.headers.get('host')?.includes('netlify.app')) {
    return NextResponse.redirect(canonicalUrl, {
      status: 301,
      headers: {
        'Link': `<${canonicalUrl}>; rel="canonical"`,
        'X-Robots-Tag': 'index, follow'
      }
    });
  }

  // Return response with updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
