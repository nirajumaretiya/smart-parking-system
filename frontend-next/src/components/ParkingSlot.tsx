'use client';

interface ParkingSlotProps {
  slotNumber: number;
  isOccupied: boolean;
  lastUpdated: string;
  duration: string;
}

export default function ParkingSlot({
  slotNumber,
  isOccupied = false,
  lastUpdated = '-',
  duration = '-'
}: ParkingSlotProps) {
  return (
    <div className="glass-effect rounded-lg p-6 slot-card" id={`slot-${slotNumber}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span 
            className={`status-indicator ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`} 
            id={`status-indicator-${slotNumber}`}
          ></span>
          <h3 className="text-lg font-medium text-gray-900">Slot {slotNumber}</h3>
        </div>
        <div className="flex space-x-2">
          <div 
            className={`w-3 h-3 rounded-full bg-red-500 ${isOccupied ? '' : 'opacity-30'}`} 
            id={`red-${slotNumber}`}
          ></div>
          <div 
            className={`w-3 h-3 rounded-full bg-green-500 ${isOccupied ? 'opacity-30' : ''}`} 
            id={`green-${slotNumber}`}
          ></div>
        </div>
      </div>
      <div className="space-y-2">
        <p 
          className={`text-sm font-medium ${isOccupied ? 'text-red-600' : 'text-green-600'}`} 
          id={`status-${slotNumber}`}
        >
          {isOccupied ? 'Occupied' : 'Available'}
        </p>
        <div className="text-xs text-gray-400">
          <p>Last Updated: <span id={`slot-timestamp-${slotNumber}`}>{lastUpdated}</span></p>
          <p>Duration: <span id={`slot-duration-${slotNumber}`}>{duration}</span></p>
        </div>
      </div>
    </div>
  );
} 