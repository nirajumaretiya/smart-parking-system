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
      const data = await response.json();
      setParkingStatus(data);
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
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
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
