import React from 'react';
import { Link } from '@remix-run/react';
import { Home, BarChart, Upload, Settings, Repeat } from 'lucide-react';

const Navigation = () => {
  return (
    <nav>
      <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700">
        <Home size={16} className="mr-2" /> Dashboard
      </Link>
      <Link to="/analytics" className="flex items-center p-2 hover:bg-gray-700">
        <BarChart size={16} className="mr-2" /> Analytics
      </Link>
      <Link to="/uploads" className="flex items-center p-2 hover:bg-gray-700">
        <Upload size={16} className="mr-2" /> Uploads
      </Link>
      <Link to="/settings" className="flex items-center p-2 hover:bg-gray-700">
        <Settings size={16} className="mr-2" /> Settings
      </Link>
      <Link to="/activity-replay" className="flex items-center p-2 hover:bg-gray-700">
        <Repeat size={16} className="mr-2" /> Activity Replay
      </Link>
    </nav>
  );
};

export default Navigation;
