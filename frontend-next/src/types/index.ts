export interface SlotData {
  occupied: boolean;
  timestamp: string | null;
  duration: string | null;
}

export interface ParkingStatus {
  slots: SlotData[];
  timestamp: string;
  statistics: {
    availableSlots: number;
    occupancyRate: string;
  };
  systemStatus: string;
} 