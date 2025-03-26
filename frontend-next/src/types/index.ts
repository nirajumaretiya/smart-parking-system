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

// Backend API response types
export interface BackendSlot {
  id: number;
  occupied: boolean;
}

export interface BackendStatus {
  slots: BackendSlot[];
  timestamp: string;
}

export interface BackendStatistics {
  total_slots: number;
  occupied_slots: number;
  available_slots: number;
  occupancy_rate: number;
  last_update: string;
} 