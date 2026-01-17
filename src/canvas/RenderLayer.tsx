import React, { useState } from 'react';
import { useStore } from '../store/useStore.ts';
import type { BoardObject, ShapeType } from '../store/useStore.ts';
import { useCoordinates } from '../hooks/useCoordinates.ts';

export default function RenderLayer() {
  const { boardObjects, updateObject, deleteObject, activeTool } = useStore();
  const { screenToWorld } = useCoordinates();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [transform, setTransform] = useState<{ id: string; type: string; startX: number; startY: number; startW: number; startH: number } | null>(null);

  const getClipPath = (type?: ShapeType) => {
    switch (type) {
      case 'triangle': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'hexagon': return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'pentagon': return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'arrow': return 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)';
      case 'star': return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'diamond': return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'parallelogram': return 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)';
      case 'trapezium': return 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)';
      case 'circle': return 'circle(50% at 50% 50%)';
      default: return 'none';
    }
  };

  const getHandleClass = (h: string) => {
    const base = "t-handle rounded-sm w-3 h-3 bg-white border-2 border-amber-500 pointer-events-auto absolute z-[200] ";
    if (h === 'nw') return base + "-top-1.5 -left-1.5 cursor-nw-resize";
    if (h === 'n')  return base + "-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize";
    if (h === 'ne') return base + "-top-1.5 -right-1.5 cursor-ne-resize";
    if (h === 'e')  return base + "top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize";
    if (h === 'se') return base + "-bottom-1.5 -right-1.5 cursor-se-resize";
    if (h === 's')  return base + "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize";
    if (h === 'sw') return base + "-bottom-1.5 -left-1.5 cursor-sw-resize";
    if (h === 'w')  return base + "top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize";
    return "";
  };

  const isSelectMode = activeTool === 'select';

  const handlePointerMove = (e: React.PointerEvent) => {
  // 1. Get world coordinates
  const worldPos = screenToWorld(e.clientX, e.clientY);
  
  if (dragState) {
    // 2. Optimized Dragging Logic
    const newX = worldPos.x - dragState.ox;
    const newY = worldPos.y - dragState.oy;
    
    // updateObject automatically emits if you set up the store correctly
    updateObject(dragState.id, { x: newX, y: newY });

  } else if (transform) {
    // 3. Resizing Logic with Broadcast
    const { type, startX, startY, startW, startH } = transform;
    const updates: Partial<BoardObject> = {};
    
    if (type.includes('e')) updates.width = Math.max(20, worldPos.x - startX);
    if (type.includes('s')) updates.height = Math.max(20, worldPos.y - startY);
    if (type.includes('n')) { 
      updates.y = worldPos.y; 
      updates.height = Math.max(20, startH + (startY - worldPos.y)); 
    }
    if (type.includes('w')) { 
      updates.x = worldPos.x; 
      updates.width = Math.max(20, startW + (startX - worldPos.x)); 
    }
    
    // Update locally and sync with others
    updateObject(transform.id, updates);
  }
};
  return (
    <div className="relative w-full h-full pointer-events-none z-[100]" onPointerMove={handlePointerMove} onPointerUp={() => { setDragState(null); setTransform(null); }}>
      
      {/* 1. DRAWING LAYER */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-[5]">
        {boardObjects.filter(o => o.type === 'path').map(obj => (
          <polyline key={obj.id} points={obj.points?.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={obj.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>

      {/* 2. OBJECTS LAYER */}
      {boardObjects.filter(o => o.type !== 'path').map((obj) => (
        <div 
          key={obj.id} 
          onPointerDown={(e) => {
            if (!isSelectMode) return; 
            const target = e.target as HTMLElement;
            const worldPos = screenToWorld(e.clientX, e.clientY);
            if (target.classList.contains('t-handle')) {
              e.stopPropagation();
              setTransform({ id: obj.id, type: target.getAttribute('data-handle') || '', startX: obj.x, startY: obj.y, startW: obj.width, startH: obj.height });
              return;
            }
            if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'BUTTON') { 
              e.stopPropagation(); return; 
            }
            e.stopPropagation();
            setDragState({ id: obj.id, ox: worldPos.x - obj.x, oy: worldPos.y - obj.y });
          }} 
          style={{ 
            position: 'absolute', left: obj.x, top: obj.y, width: obj.width, height: obj.height, 
            transform: `rotate(${obj.rotation || 0}deg)`, zIndex: menuOpen === obj.id ? 150 : 20,
            pointerEvents: isSelectMode || menuOpen === obj.id ? 'auto' : 'none' 
          }} 
          className="group"
        >
          <div className="w-full h-full relative" style={{ pointerEvents: 'none' }}>
            {obj.type === 'shape' ? (
              <div className="w-full h-full shadow-sm" style={{ backgroundColor: obj.color, clipPath: getClipPath(obj.shapeType) }} />
            ) : obj.type === 'sticky' ? (
              <div className="w-full h-full flex flex-col rounded-xl shadow-md border border-stone-200/50 overflow-hidden" style={{ backgroundColor: obj.color }}>
                <input className="bg-black/5 px-3 py-3 border-b border-black/5 text-[10px] font-bold uppercase tracking-widest outline-none placeholder:text-black/30 pointer-events-auto" placeholder="ADD TITLE" defaultValue={obj.title} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => updateObject(obj.id, { title: e.target.value })} />
                <textarea className="w-full h-full p-4 bg-transparent outline-none resize-none pointer-events-auto placeholder:text-stone-400 font-medium" placeholder="Write a note..." defaultValue={obj.text} onPointerDown={(e) => e.stopPropagation()} onBlur={(e) => updateObject(obj.id, { text: e.target.value })} />
              </div>
            ) : obj.type === 'text' ? (
              /* TEXT TOOL RENDER LOGIC FIXED */
              <textarea 
                className="w-full h-full bg-transparent outline-none resize-none pointer-events-auto font-bold text-xl p-2" 
                style={{ color: obj.color }} 
                placeholder="Type text..." 
                defaultValue={obj.text} 
                onPointerDown={(e) => e.stopPropagation()} 
                onBlur={(e) => updateObject(obj.id, { text: e.target.value })} 
              />
            ) : obj.type === 'image' && <img src={obj.imageUrl} className="w-full h-full object-cover rounded-lg shadow-lg pointer-events-none" />}
          </div>

          <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === obj.id ? null : obj.id); }} className="absolute -top-7 right-0 bg-slate-700/90 text-white rounded px-2 py-0.5 text-[10px] font-bold opacity-0 group-hover:opacity-100 z-[160] pointer-events-auto">⋮</button>

          {menuOpen === obj.id && (
            <div className="absolute -top-20 right-0 bg-white shadow-2xl border border-stone-200 rounded-lg flex flex-col z-[170] py-1 min-w-[120px] pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
              <button className="px-3 py-2 text-[10px] font-bold hover:bg-stone-50 text-left border-b border-stone-100 text-stone-700" onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { showHandles: !obj.showHandles }); setMenuOpen(null); }}>
                {obj.showHandles ? "Hide Handles" : "Resize Mode"}
              </button>
              <button className="px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 text-left" onClick={(e) => { e.stopPropagation(); deleteObject(obj.id); setMenuOpen(null); }}>Delete Object</button>
            </div>
          )}

          {obj.showHandles && (
            <div className="absolute -inset-1 border-2 border-amber-400 pointer-events-none z-[200]">
              {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => <div key={h} data-handle={h} className={getHandleClass(h)} />)}
              <div data-handle="rotate" className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full border-2 border-white cursor-alias pointer-events-auto shadow-lg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}