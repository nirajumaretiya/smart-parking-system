'use client';

interface StatsProps {
  availableSlots: number | string;
  occupancyRate: string;
  lastUpdated: string;
  systemStatus: string;
}

export default function StatsOverview({
  availableSlots = '-',
  occupancyRate = '-',
  lastUpdated = '-',
  systemStatus = 'Offline'
}: StatsProps) {
  const isOnline = systemStatus === 'Online';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="glass-effect rounded-lg p-6 stats-card">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <i className="fas fa-car text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Available Slots</p>
            <p className="text-2xl font-bold text-gray-800 mt-1" id="available-slots">{availableSlots}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6 stats-card">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <i className="fas fa-chart-line text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-800 mt-1" id="occupancy-rate">{occupancyRate}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6 stats-card">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="fas fa-clock text-xl"></i>
          </div>
          <div className="ml-4 overflow-hidden">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Updated</p>
            <p className="text-sm font-bold text-gray-800 mt-1 truncate" id="timestamp">{lastUpdated}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6 stats-card">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <i className="fas fa-server text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">System Status</p>
            <p className={isOnline ? 'system-status-online' : 'system-status-offline'} id="system-status">
              {systemStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 