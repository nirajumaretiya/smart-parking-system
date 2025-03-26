import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'include', // Include cookies in the request
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, create a default error object
      data = { error: 'Server returned non-JSON response' };
    }
    
    if (response.ok) {
      // Get cookies from response
      const responseCookies = response.headers.get('set-cookie');
      
      const headers = new Headers();
      
      // If cookies were set in the response, use them
      if (responseCookies) {
        headers.set('Set-Cookie', responseCookies);
      } else {
        // Otherwise set our own session cookie
        const sessionCookie = 'session=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400';
        headers.set('Set-Cookie', sessionCookie);
      }
      
      return NextResponse.json(
        { success: true },
        { 
          status: 200,
          headers
        }
      );
    } else {
      return NextResponse.json(
        { message: data.error || 'Login failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
} 