'use client';

import { useState, useEffect } from 'react';

interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  utilization: number;
  averageParkingTime: number;
  peakHour: string;
}

export default function ParkingStatistics() {
  const [stats, setStats] = useState<ParkingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch parking statistics');
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching parking statistics:', err);
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 30 seconds
    const intervalId = setInterval(fetchStats, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="bg-red-100 text-red-700 p-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Statistics</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Utilization Rate</p>
          <p className="text-2xl font-bold">{stats.utilization}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${stats.utilization}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Avg. Parking Time</p>
            <p className="text-xl font-semibold">{stats.averageParkingTime} mins</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peak Hour</p>
            <p className="text-xl font-semibold">{stats.peakHour}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Current Occupancy:</span>
            <span className="font-bold">{stats.occupiedSpots} / {stats.totalSpots}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 