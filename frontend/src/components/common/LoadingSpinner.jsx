import React from 'react';
import { Music } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div className={`animate-spin ${className}`}>
    <Music size={size} className="text-current" />
  </div>
);

export default LoadingSpinner;