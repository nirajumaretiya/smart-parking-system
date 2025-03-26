import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/api/export', {
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
    
    // Get CSV data
    const csvData = await response.text();
    
    // Create a timestamp for the filename
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    // Return the CSV with appropriate headers for download
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="parking-history-${timestamp}.csv"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
} 