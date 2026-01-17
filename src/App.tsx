import React, { useEffect } from 'react';
import Viewport from './canvas/Viewport';
import ToolsPanel from './components/ToolsPanel';
import TopToolbar from './components/TopToolbar';
import BottomStatusBar from './components/BottomStatusBar';
import { useStore } from './store/useStore.ts';

export default function App() {
  // Extracting initCollaboration inside the component
  

  const initCollaboration = useStore((s) => s.initCollaboration);
  const terminateCollaboration = useStore((s) => s.terminateCollaboration);

  useEffect(() => {
    
    initCollaboration();

    
    return () => {
      terminateCollaboration();
    };
  }, [initCollaboration, terminateCollaboration]);
 

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#E7E2D8]">
      {/* Background Canvas Layer */}
      <div className="absolute inset-0 z-[1]">
        <Viewport />
      </div>
      <div className="w-screen h-screen">
      {/* Aapka Board Logic */}
    </div>

      {/* Foreground UI Layer */}
      <div className="absolute inset-0 pointer-events-none z-[9999]">
        <div className="pointer-events-auto contents">
          <TopToolbar />
          <ToolsPanel />
          <BottomStatusBar />
        </div>
      </div>
    </div>
  );
}
