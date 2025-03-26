import { NextRequest, NextResponse } from 'next/server';
import { BackendStatus, BackendStatistics, ParkingStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get cookie for authentication
    const cookie = request.headers.get('cookie') || '';
    
    // Forward the status request to the Flask backend
    const statusResponse = await fetch('http://localhost:5000/api/status', {
      method: 'GET',
      headers: { Cookie: cookie },
      credentials: 'include'
    });
    
    // If not authenticated, return 401
    if (statusResponse.status === 401) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Also get statistics from the backend
    const statsResponse = await fetch('http://localhost:5000/api/statistics', {
      method: 'GET',
      headers: { Cookie: cookie },
      credentials: 'include'
    });
    
    // Parse JSON responses from Flask backend
    const statusData: BackendStatus = await statusResponse.json();
    let statsData: BackendStatistics | null = null;
    
    if (statsResponse.ok) {
      statsData = await statsResponse.json();
    }
    
    // Transform data to match frontend expectations
    const frontendData: ParkingStatus = {
      slots: statusData.slots.map(slot => ({
        occupied: slot.occupied,
        timestamp: statusData.timestamp || null,
        duration: null // Backend doesn't provide duration yet
      })),
      timestamp: statusData.timestamp || new Date().toLocaleTimeString(),
      statistics: {
        // Use statistics from backend if available, otherwise calculate from status
        availableSlots: statsData?.available_slots || 
          statusData.slots.filter(slot => !slot.occupied).length,
        occupancyRate: statsData ? 
          `${statsData.occupancy_rate.toFixed(1)}%` : 
          `${Math.round((statusData.slots.filter(slot => slot.occupied).length / statusData.slots.length) * 100)}%`
      },
      systemStatus: 'Online'
    };
    
    return NextResponse.json(frontendData);
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