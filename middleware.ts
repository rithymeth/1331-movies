import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the current hostname and pathname
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search || '';
  
  // Define target domain and canonical URL
  const targetDomain = 'https://1331-movies-kh.com';
  const canonicalUrl = `${targetDomain}${pathname}${search}`;

  // If accessing from Netlify subdomain, redirect to custom domain
  if (hostname.includes('netlify.app')) {
    // Create a new URL for the redirect
    const url = request.nextUrl.clone();
    url.protocol = 'https';
    url.host = '1331-movies-kh.com';
    
    return NextResponse.redirect(url, { 
      status: 301,
      headers: {
        'Link': `<${canonicalUrl}>; rel="canonical"`,
        'X-Robots-Tag': 'index, follow',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  }

  // For the main domain, just add the headers
  const response = NextResponse.next();
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
