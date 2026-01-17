import React, { useRef, useState } from 'react';
import { 
  MousePointer2, Hand, Pencil, Square, 
  Type, StickyNote, Image as ImageIcon, 
  Circle, Triangle, Palette, ArrowUpRight, 
  Hexagon, Pentagon, Star,Diamond, Layout 
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';

export default function ToolsPanel() {
  const { 
    activeTool, setActiveTool, addObject, 
    selectedShapeType, setSelectedShapeType,
    selectedColor, setSelectedColor 
  } = useStore();
  
  const [showShapes, setShowShapes] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    '#ec9494', '#ef4444', '#f75151', '#df0e0e', 
    '#a2bfed', '#3f86f1', '#224aeb', '#190692',
    '#d9ec96', '#e6d732', '#edca08', '#f1da06',
    '#7eef8f', '#30eb40', '#10d813', '#067c10',
    '#eea4e3', '#f353c0', '#f711ae', '#901d6f'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addObject({
          id: crypto.randomUUID(), type: 'image', x: 200, y: 200, width: 300, height: 200,
          imageUrl: event.target?.result as string, color: 'transparent', text: '', title: ''
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to handle shape selection correctly
  const selectShape = (type: string) => {
    setSelectedShapeType(type as any);
    setActiveTool('shape');
    setShowShapes(false);
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-slate-200/50 z-[1000]">
      
      <button onClick={() => { setActiveTool('select'); setShowShapes(false); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'select' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><MousePointer2 size={20} /></button>
      <button onClick={() => { setActiveTool('pan'); setShowShapes(false); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'pan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><Hand size={20} /></button>
      
      <div className="w-full h-px bg-slate-200" />

      <button onClick={() => { setActiveTool('draw'); setShowShapes(false); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'draw' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><Pencil size={20} /></button>
      
      {/* SHAPES POP-OUT - EXTENDED SHAPES */}
      <div className="relative">
        <button onClick={() => { setShowShapes(!showShapes); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'shape' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
          <Square size={20} />
        </button>
        {showShapes && (
          <div className="absolute left-16 top-0 ml-2 bg-white shadow-2xl border border-slate-100 rounded-2xl p-2 grid grid-cols-2 gap-1 min-w-[280px] z-[2000]">
            <button onClick={() => selectShape('rect')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Square size={14} /> Square</button>
            <button onClick={() => selectShape('circle')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Circle size={14} /> Circle</button>
            <button onClick={() => selectShape('triangle')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Triangle size={14} /> Triangle</button>
            <button onClick={() => selectShape('arrow')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><ArrowUpRight size={14} /> Arrow</button>
            <button onClick={() => selectShape('hexagon')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Hexagon size={14} /> Hexagon</button>
            <button onClick={() => selectShape('pentagon')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Pentagon size={14} /> Pentagon</button>
            <button onClick={() => selectShape('star')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Star size={14} /> Star</button>
            <button onClick={() => selectShape('diamond')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase">< Diamond size={14} /> Diamond</button>
            <button onClick={() => selectShape('parallelogram')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Layout size={14} className="rotate-12" /> Parallelogram</button>
            <button onClick={() => selectShape('trapezium')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase"><Layout size={14} /> Trapezium</button>
          </div>
        )}
      </div>

      <button onClick={() => { setActiveTool('text'); setShowShapes(false); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'text' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><Type size={20} /></button>
      <button onClick={() => { setActiveTool('sticky'); setShowShapes(false); setShowColors(false); }} className={`p-3 rounded-xl ${activeTool === 'sticky' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><StickyNote size={20} /></button>
      
      <button onClick={() => { fileInputRef.current?.click(); setShowShapes(false); setShowColors(false); }} className="p-3 rounded-xl hover:bg-slate-100 text-slate-600"><ImageIcon size={20} /></button>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="w-full h-px bg-slate-200" />

      {/* COLORS PANEL */}
      <div className="relative">
        <button onClick={() => { setShowColors(!showColors); setShowShapes(false); }} className="p-3 rounded-xl hover:bg-slate-100 transition-colors" style={{ color: selectedColor }}>
          <Palette size={20} />
        </button>
        {showColors && (
          <div className="absolute left-16 bottom-0 ml-2 bg-white shadow-2xl border border-slate-100 rounded-2xl p-4 grid grid-cols-4 gap-3 z-[2000]">
            {colors.map(c => (
              <button 
                key={c} 
                onClick={() => { setSelectedColor(c); setShowColors(false); }}
                className={`w-7 h-7 rounded-full border border-slate-200 transition-transform hover:scale-125 ${selectedColor === c ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}