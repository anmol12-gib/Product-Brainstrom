import { useStore } from '../store/useStore.ts';

export default function BottomStatusBar() {
  const { viewport, updateViewport, boardObjects, activeTool } = useStore();

  const handleZoom = (delta: number) => {
    const newZoom = Math.min(Math.max(viewport.zoom + delta, 0.1), 5);
    updateViewport({ zoom: newZoom });
  };

  return (
    <footer className="fixed bottom-4 left-4 right-4 h-12 z-[1000] flex items-center justify-between pointer-events-none">
      {/* Left: Sync Status & Object Count */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-200/50 flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Syncing</span>
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <span className="text-[10px] font-bold text-slate-400">{boardObjects.length} Objects</span>
      </div>

      {/* CENTER: STEP 3 - ACTIVE TOOL INDICATOR */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-slate-900 text-white px-6 py-2 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Tool</span>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-[11px] font-black uppercase text-blue-400 tracking-widest">
            {activeTool}
          </span>
        </div>
      </div>

      {/* Right: Zoom & Viewport Offset */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Viewport Offset (Current Position) */}
        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-slate-200/50">
          <span className="text-[10px] font-black text-slate-500 font-mono">
            OFFSET: {Math.round(viewport.x)}, {Math.round(viewport.y)}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200/50 flex items-center gap-1">
          <button onClick={() => handleZoom(-0.1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg font-bold text-slate-600">−</button>
          <span className="text-[11px] font-black w-10 text-center text-slate-700">{Math.round(viewport.zoom * 100)}%</span>
          <button onClick={() => handleZoom(0.1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg font-bold text-slate-600">+</button>
        </div>

        {/* Live Cursor Coordinates */}
        <div className="bg-slate-800 text-white px-3 py-2 rounded-xl shadow-lg border border-slate-700">
          <span className="text-[10px] font-bold font-mono tracking-tighter">
            CURSOR: {viewport.currentX} : {viewport.currentY}
          </span>
        </div>
      </div>
    </footer>
  );
}