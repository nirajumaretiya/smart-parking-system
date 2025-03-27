'use client';

interface SystemInfoProps {
  onRefresh: () => void;
  onExport: () => void;
}

export default function SystemInfo({ onRefresh, onExport }: SystemInfoProps) {
  return (
    <div className="mt-8 glass-effect rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
            System Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">Real-time monitoring and status updates</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            className="btn btn-secondary flex items-center justify-center" 
            data-action="refresh"
            onClick={onRefresh}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
          <button 
            className="btn btn-primary flex items-center justify-center" 
            data-action="export"
            onClick={onExport}
          >
            <i className="fas fa-download mr-2"></i>
            Export
          </button>
        </div>
      </div>
    </div>
  );
} 