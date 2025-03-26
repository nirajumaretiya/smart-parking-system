import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes and login page
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // Check if the user is authenticated by verifying the session
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the session with the backend
    const response = await fetch('http://localhost:5000/api/verify-session', {
      method: 'GET',
      headers: {
        Cookie: `session=${sessionCookie.value}`,
      }
    });

    if (!response.ok) {
      // Redirect to login page if session is invalid
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    // If there's an error with the backend, allow the request to proceed
    // The frontend will handle the error appropriately
    console.error('Session verification error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}; 