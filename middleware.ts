import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the current hostname and pathname
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Define target domain and canonical URL
  const targetDomain = 'https://1331-movies-kh.com';
  const canonicalUrl = `${targetDomain}${pathname}`;

  // Create response object
  let response: NextResponse;

  // If accessing from Netlify subdomain, redirect to custom domain
  if (hostname.includes('netlify.app')) {
    response = NextResponse.redirect(canonicalUrl, { status: 301 });
  } else {
    // Otherwise, continue with the request
    response = NextResponse.next();
  }

  // Add headers to all responses
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  return response;
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
