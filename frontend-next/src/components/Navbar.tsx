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
    <nav className="glass-effect fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <i className="fas fa-parking text-2xl text-blue-600 mr-2"></i>
            <h1 className="text-2xl font-bold text-gray-800">Smart Parking System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <i className="fas fa-clock mr-1"></i>
              <span id="current-time">{currentTime}</span>
            </div>
            <a href="/api/logout" 
              className="btn btn-primary">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 