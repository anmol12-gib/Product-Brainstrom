// CollaborationLayer.tsx
import React from 'react';
import { useStore } from '../store/useStore.ts';

export default function CollaborationLayer() {
  const { others } = useStore();

  return (
    // Z-index 900 taaki cursors sabse upar rahein
    <div className="absolute inset-0 pointer-events-none z-[900] overflow-hidden">
      {others.map((user) => (
        <div
          key={user.id}
          className="absolute transition-all duration-100 ease-out"
          style={{ 
            left: user.x, 
            top: user.y,
            willChange: 'transform' // Performance ke liye
          }}
        >
          {/* Cursor Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" 
              fill={user.color} 
              stroke="white" 
              strokeWidth="1.5"
            />
          </svg>
          
          {/* Label */}
          <div 
            className="ml-3 px-2 py-0.5 rounded shadow-lg text-[10px] font-bold text-white whitespace-nowrap"
            style={{ backgroundColor: user.color }}
          >
            User_{user.id.slice(0, 4)}
          </div>
        </div>
      ))}
    </div>
  );
}