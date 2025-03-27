'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StatsOverview from '@/components/StatsOverview';
import ParkingSlot from '@/components/ParkingSlot';
import SystemInfo from '@/components/SystemInfo';
import { ParkingStatus, SlotData } from '@/types';

export default function Home() {
  const [parkingStatus, setParkingStatus] = useState<ParkingStatus>({
    slots: Array(4).fill({ occupied: false, timestamp: null, duration: null }),
    timestamp: '-',
    statistics: {
      availableSlots: 0,
      occupancyRate: '0%',
    },
    systemStatus: 'Offline'
  });

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend structure
      const transformedData = {
        slots: data.slots.map((slot: any) => ({
          occupied: slot.occupied,
          timestamp: data.timestamp || null,
          duration: null // Backend doesn't provide duration yet
        })),
        timestamp: data.timestamp || '-',
        statistics: {
          // Calculate available slots from the slots data
          availableSlots: data.slots ? data.slots.filter((slot: any) => !slot.occupied).length : 0,
          // Format occupancy rate
          occupancyRate: data.slots ? 
            `${Math.round((data.slots.filter((slot: any) => slot.occupied).length / data.slots.length) * 100)}%` : 
            '0%'
        },
        systemStatus: 'Online'
      };
      
      setParkingStatus(transformedData);
    } catch (error) {
      console.error('Error fetching status:', error);
      setParkingStatus(prev => ({
        ...prev,
        systemStatus: 'Offline'
      }));
    }
  };

  const handleExport = async () => {
    try {
      window.open('/api/export', '_blank');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStatus();
    
    // Set up interval for periodic updates
    const intervalId = setInterval(fetchStatus, 1000);
    
    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <StatsOverview 
          availableSlots={parkingStatus.statistics.availableSlots}
          occupancyRate={parkingStatus.statistics.occupancyRate}
          lastUpdated={parkingStatus.timestamp}
          systemStatus={parkingStatus.systemStatus}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {parkingStatus.slots.map((slot: SlotData, index: number) => (
            <ParkingSlot 
              key={index}
              slotNumber={index + 1}
              isOccupied={slot.occupied}
              lastUpdated={slot.timestamp || '-'}
              duration={slot.duration || '-'}
            />
          ))}
        </div>
        
        <SystemInfo 
          onRefresh={fetchStatus}
          onExport={handleExport}
        />
      </main>
    </>
  );
}
