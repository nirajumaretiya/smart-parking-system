'use client';

import { useState, useEffect } from 'react';

interface ParkingEvent {
  id: number;
  spotId: number;
  timestamp: string;
  event: 'arrival' | 'departure';
  duration?: number;
}

export default function ParkingHistory() {
  const [history, setHistory] = useState<ParkingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/history?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch parking history');
        }
        const data = await response.json();
        setHistory(data.events || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching parking history:', err);
        setError('Failed to load history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  const handleExport = async () => {
    try {
      window.open('/api/export-csv', '_blank');
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Parking History</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No parking events recorded yet.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spot ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Spot {event.spotId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(event.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.event === 'arrival' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.event === 'arrival' ? 'Arrival' : 'Departure'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.duration ? `${event.duration} mins` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
} 