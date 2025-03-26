'use client';

interface SystemInfoProps {
  onRefresh: () => void;
  onExport: () => void;
}

export default function SystemInfo({ onRefresh, onExport }: SystemInfoProps) {
  return (
    <div className="mt-8 glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">System Information</h3>
          <p className="text-sm text-gray-500">Real-time monitoring and status updates</p>
        </div>
        <div className="flex space-x-4">
          <button 
            className="btn btn-secondary" 
            data-action="refresh"
            onClick={onRefresh}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
          <button 
            className="btn btn-secondary" 
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