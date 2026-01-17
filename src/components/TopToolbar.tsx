import React, { useState } from 'react'; // Added useState import
import { useStore } from '../store/useStore.ts';

export default function TopToolbar() {
  const { 
    undo, redo, history = [], redoStack = [], 
    updateViewport, resetBoard, others 
  } = useStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 h-14 z-[100] flex items-center justify-between pointer-events-none">
      {/* 1. Board Info Section */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 flex items-center gap-3 pointer-events-auto">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-none">Product Brainstorm</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Team Workspace</p>
        </div>
      </div>

      {/* 2. Center History & Reset Controls */}
      <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200/50 flex gap-1 pointer-events-auto">
        <button onClick={undo} disabled={history.length === 0} className="px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30">UNDO</button>
        <button onClick={redo} disabled={redoStack.length === 0} className="px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30">REDO</button>
        <div className="w-px h-4 bg-slate-200 my-auto mx-1" />
        <button 
          onClick={() => {
            if (window.confirm("Are you sure? This will clear everything!")) {
              resetBoard();
              updateViewport({ x: 0, y: 0, zoom: 1 });
            }
          }} 
          className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl"
        >
          RESET
        </button>
      </div>

      {/* 3. Integrated Avatars & Share Section */}
      <div className="flex items-center gap-3 pointer-events-auto relative">
        {/* Avatars Clickable Area */}
        <div className="flex -space-x-2 cursor-pointer transition-transform hover:scale-105" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {others.slice(0, 3).map((user) => (
            <div 
              key={user.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: user.color }}
            >
              {user.id.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {others.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-600">
              +{others.length - 3}
            </div>
          )}
          {/* Me/Host Icon if no others are connected */}
          {others.length === 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              ME
            </div>
          )}
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
          SHARE
        </button>

        {/* Dynamic Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-14 right-0 w-56 bg-white border border-stone-200 shadow-2xl rounded-2xl py-3 z-[110] animate-in fade-in slide-in-from-top-2">
            <div className="px-4 pb-2 border-b border-stone-100 text-[9px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Connected Users ({others.length + 1})
            </div>
            
            <div className="max-h-64 overflow-y-auto pt-2">
              {/* Host / Local User */}
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-black text-white shadow-inner">YOU</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-800">Me (Host)</span>
                  <span className="text-[9px] text-green-500 font-bold uppercase">Online</span>
                </div>
              </div>

              {/* Remote Users */}
              {others.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-inner" style={{ backgroundColor: user.color }}>
                    {user.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-stone-600 italic">User_{user.id.slice(0, 4)}</span>
                    <span className="text-[9px] text-stone-400 font-bold">Collaborator</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}