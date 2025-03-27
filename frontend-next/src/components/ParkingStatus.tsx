'use client';

import { useState, useEffect } from 'react';

interface ParkingSpot {
  id: number;
  status: 'occupied' | 'available';
}

export default function ParkingStatus() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch parking status');
        }
        const data = await response.json();
        setSpots(data.spots || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching parking status:', err);
        setError('Failed to load parking status');
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Parking Status</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Parking Status</h2>
        <div className="bg-red-100 text-red-700 p-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const availableSpots = spots.filter(spot => spot.status === 'available').length;
  const totalSpots = spots.length;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Parking Status</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Available Spots:</span>
          <span className="font-bold text-lg">{availableSpots} / {totalSpots}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(availableSpots / totalSpots) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {spots.map((spot) => (
          <div 
            key={spot.id}
            className={`p-3 rounded-lg text-center ${
              spot.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="font-semibold">Spot {spot.id}</p>
            <p className="text-sm capitalize">{spot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 