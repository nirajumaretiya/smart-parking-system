import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/api/status', {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      }
    });
    
    // If not authenticated, return 401
    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse JSON response from Flask backend
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching status:', error);
    
    // Return a fallback status with system offline
    return NextResponse.json({
      slots: Array(4).fill({ occupied: false, timestamp: null, duration: null }),
      timestamp: new Date().toLocaleTimeString(),
      statistics: {
        availableSlots: 0,
        occupancyRate: '0%',
      },
      systemStatus: 'Offline'
    });
  }
} 