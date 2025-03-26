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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <i className="fas fa-car text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Available Slots</p>
            <p className="text-2xl font-semibold text-gray-800" id="available-slots">{availableSlots}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <i className="fas fa-chart-line text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Occupancy Rate</p>
            <p className="text-2xl font-semibold text-gray-800" id="occupancy-rate">{occupancyRate}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="fas fa-clock text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-sm font-semibold text-gray-800" id="timestamp">{lastUpdated}</p>
          </div>
        </div>
      </div>
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <i className="fas fa-temperature-high text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">System Status</p>
            <p className={`text-sm font-semibold ${systemStatus === 'Online' ? 'text-green-600' : 'text-red-600'}`} id="system-status">
              {systemStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 