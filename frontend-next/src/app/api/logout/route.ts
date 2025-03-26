import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/logout', {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });
    
    // Clear cookies and redirect to login page
    const headers = new Headers();
    headers.append('Location', '/login');
    headers.append('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    
    return new NextResponse(null, {
      status: 302,
      headers
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
} 