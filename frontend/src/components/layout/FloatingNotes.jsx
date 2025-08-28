import React from 'react';
import { Music, Heart, Headphones, Mic, Volume2, Radio } from 'lucide-react';

const FloatingNotes = ({ 
  count = 20, 
  className = "",
  icons = [Music, Heart, Headphones, Mic, Volume2, Radio]
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => {
        const IconComponent = icons[Math.floor(Math.random() * icons.length)];
        const size = 16 + Math.random() * 24;
        const animationDuration = 2 + Math.random() * 4;
        const animationDelay = Math.random() * 3;
        
        return (
          <div
            key={i}
            className="absolute animate-bounce text-white opacity-5 hover:opacity-20 transition-opacity duration-1000"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${animationDelay}s`,
              animationDuration: `${animationDuration}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            <IconComponent size={size} />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingNotes;