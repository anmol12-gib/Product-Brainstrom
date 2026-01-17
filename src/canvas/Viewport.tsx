import React from 'react';
import { useStore } from '../store/useStore.ts';
import { useCoordinates } from '../hooks/useCoordinates.ts'; // Import coordinate hook
import RenderLayer from './RenderLayer';
import InteractionLayer from './InteractionLayer';
import CollaborationLayer from './CollaborationLayer';

export default function Viewport() {
  const { viewport, updateViewport, activeTool, broadcastCursor } = useStore();
  const { screenToWorld } = useCoordinates(); // Get conversion function

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Convert screen position to canvas world position
    const worldPos = screenToWorld(e.clientX, e.clientY);
  
    // 2. Broadcast cursor position for all tools
    broadcastCursor(worldPos.x, worldPos.y);

    // 3. Update local viewport status
    updateViewport({ 
      currentX: Math.round(e.clientX), 
      currentY: Math.round(e.clientY) 
    });

    // 4. Handle Panning logic
    if (activeTool === 'pan' && e.buttons === 1) {
      updateViewport({ 
        x: viewport.x + e.movementX, 
        y: viewport.y + e.movementY 
      });
    }
  };

  return (
    <div 
      className={`w-full h-full overflow-hidden relative touch-none ${
        activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      onPointerMove={handlePointerMove}
      style={{ 
        backgroundColor: '#E7E2D8', 
        backgroundImage: 'radial-gradient(#00000015 1px, transparent 1px)',
        backgroundSize: '30px 30px' 
      }}
    >
      <div 
        style={{ 
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="pointer-events-auto w-full h-full">
          {/* InteractionLayer handles drawing/creation */}
          <InteractionLayer />
          
          {/* RenderLayer handles existing objects and selection */}
          <RenderLayer />
          
          {/* CollaborationLayer shows remote cursors */}
          <CollaborationLayer /> 
        </div>
      </div>
    </div>
  );
}