import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/logout', '/api'];

export async function middleware(req: NextRequest) {
  // Get the pathname
  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Skip middleware for static assets and images
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Get the auth cookie and check if it exists
  const authCookie = req.cookies.get('supabase-auth')?.value;
  
  if (!authCookie) {
    console.log(`[Auth] No auth cookie found, redirecting from ${pathname} to login`);
    const url = new URL('/login', req.url);
    url.searchParams.set('from', pathname);
    
    // Add cache control headers to prevent caching
    const response = NextResponse.redirect(url);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }
  
  // Try to verify the token by checking if it's a valid JWT format
  // A very basic check - JWT tokens have 3 parts separated by dots
  const isValidTokenFormat = authCookie.split('.').length === 3;
  
  if (!isValidTokenFormat) {
    console.log(`[Auth] Invalid token format, redirecting from ${pathname} to login`);
    const url = new URL('/login', req.url);
    url.searchParams.set('from', pathname);
    
    // Clear the invalid cookie in the response
    const response = NextResponse.redirect(url);
    response.cookies.delete('supabase-auth');
    
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }
  
  // User is authenticated, let them proceed
  const response = NextResponse.next();
  
  // Add cache control headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

// Run middleware on all routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 