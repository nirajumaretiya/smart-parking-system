import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Set cookies based on Flask session
      const cookies = response.headers.get('set-cookie');
      
      return NextResponse.json(
        { success: true },
        { 
          status: 200,
          headers: cookies ? { 'Set-Cookie': cookies } : undefined
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