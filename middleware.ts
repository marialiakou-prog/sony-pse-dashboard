import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page without authentication
  if (pathname.startsWith('/auth/login')) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get('dashboard-auth');

  // For all other pages, check authentication
  if (authCookie?.value !== process.env.AUTH_SECRET) {
    // Redirect to login page
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect all routes except API routes, static files, and public assets
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, fonts, etc.)
     * - auth/login page
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
