// Format duration from seconds to minutes and seconds
export function formatDuration(seconds: number): string {
  if (!seconds) return '-';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Format timestamp
export function formatTime(timestamp: string | null): string {
  if (!timestamp) return '-';
  
  return new Date(timestamp).toLocaleTimeString();
} 