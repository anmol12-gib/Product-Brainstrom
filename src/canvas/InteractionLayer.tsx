import React, { useState } from 'react';
import { useStore } from '../store/useStore.ts';
import { useCoordinates } from '../hooks/useCoordinates.ts';
import type { BoardObject } from '../store/useStore.ts';

export default function InteractionLayer() {
  const { activeTool, addObject, updateObject, boardObjects, selectedColor, selectedShapeType, broadcastCursor } = useStore();
  const { screenToWorld } = useCoordinates();
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);

  const isCreationTool = ['draw', 'shape', 'sticky', 'text'].includes(activeTool);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isCreationTool) return; 

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const id = crypto.randomUUID();
    const { socket } = useStore.getState(); // Proper socket access

    let newObj: BoardObject | null = null;

    if (activeTool === 'draw') {
      newObj = {
        id, type: 'path', x: 0, y: 0, width: 0, height: 0,
        color: selectedColor,
        points: [{ x: worldPos.x, y: worldPos.y }]
      };
      setCurrentPathId(id);
    } else if (activeTool === 'sticky') {
      newObj = {
        id, type: 'sticky', x: worldPos.x - 100, y: worldPos.y - 100,
        width: 200, height: 200, color: selectedColor, text: '', title: '', showHandles: false
      };
    } else if (activeTool === 'shape') {
      newObj = {
        id, type: 'shape', shapeType: selectedShapeType,
        x: worldPos.x - 50, y: worldPos.y - 50, width: 100, height: 100,
        color: selectedColor, showHandles: false
      };
    } else if (activeTool === 'text') {
      newObj = {
        id, type: 'text', x: worldPos.x - 75, y: worldPos.y - 25,
        width: 150, height: 50, color: selectedColor, text: '', showHandles: false
      };
    }

    if (newObj) {
      // Add locally with emit:false because we emit manually below
      addObject(newObj, false); 
      if (socket) {
        socket.emit('object-add', newObj); // Broadcast to others
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const { socket } = useStore.getState();

    // Handle Real-time Drawing Sync
    if (activeTool === 'draw' && currentPathId && e.buttons === 1) {
      const path = boardObjects.find(obj => obj.id === currentPathId);
      if (path && path.points) {
        const newPoints = [...path.points, { x: worldPos.x, y: worldPos.y }];
        updateObject(currentPathId, { points: newPoints }, false); // Update locally
        
        if (socket) {
          socket.emit('object-update', { id: currentPathId, updates: { points: newPoints } }); // Sync points
        }
      }
    }

    broadcastCursor(worldPos.x, worldPos.y);
  };

  return (

  <div 
    className={`absolute inset-0 z-[500] touch-none ${
      isCreationTool ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
    }`}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={() => setCurrentPathId(null)}
  />
);
  
}