'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState('Loading...');

  useEffect(() => {
    // Update time immediately
    updateTime();
    
    // Update time every second
    const intervalId = setInterval(updateTime, 1000);
    
    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  function updateTime() {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString());
  }

  return (
    <nav className="glass-effect fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
              <i className="fas fa-parking text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Smart Parking System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <i className="fas fa-clock mr-2 text-blue-600"></i>
              <span id="current-time">{currentTime}</span>
            </div>
            <a href="/api/logout" 
              className="btn btn-primary py-2">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 