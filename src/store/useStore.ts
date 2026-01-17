import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export type ShapeType = 'rect' | 'circle' | 'triangle' | 'square' | 'arrow' | 'hexagon' | 'pentagon' | 'star' | 'diamond' | 'parallelogram' | 'trapezium';

interface RemoteUser {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface BoardObject {
  id: string;
  type: 'sticky' | 'text' | 'path' | 'shape' | 'image';
  x: number; 
  y: number;
  width: number; 
  height: number;
  text?: string;
  title?: string;
  color: string;
  rotation?: number; 
  shapeType?: ShapeType; 
  showHandles?: boolean; 
  points?: { x: number; y: number }[]; 
  imageUrl?: string; 
}

interface WhiteboardState {
  boardObjects: BoardObject[];
  history: BoardObject[][];
  redoStack: BoardObject[][];
  viewport: { x: number; y: number; zoom: number; currentX: number; currentY: number };
  activeTool: string;
  selectedColor: string;
  selectedShapeType: ShapeType;
  socket: Socket | null;
  others: RemoteUser[];

  // Actions
  setActiveTool: (tool: string) => void;
  setSelectedColor: (color: string) => void;
  setSelectedShapeType: (type: ShapeType) => void;
  updateViewport: (delta: Partial<WhiteboardState['viewport']>) => void;
  addObject: (obj: BoardObject, emit?: boolean) => void;
  updateObject: (id: string, updates: Partial<BoardObject>, emit?: boolean) => void;
  deleteObject: (id: string, emit?: boolean) => void;
  undo: () => void;
  redo: () => void;
  resetBoard: () => void;
  initCollaboration: () => void;
  terminateCollaboration: () => void;
  broadcastCursor: (x: number, y: number) => void;
  broadcastObjectUpdate: (id: string, updates: Partial<BoardObject>) => void;
}

export const useStore = create<WhiteboardState>((set, get) => ({
  boardObjects: [],
  history: [],
  redoStack: [],
  viewport: { x: 0, y: 0, zoom: 1, currentX: 0, currentY: 0 },
  activeTool: 'select',
  selectedColor: '#3b82f6',
  selectedShapeType: 'rect',
  socket: null,
  others: [],

  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setSelectedShapeType: (type) => set({ selectedShapeType: type }),
  updateViewport: (delta) => set((s) => ({ viewport: { ...s.viewport, ...delta } })),
  
  // Create object and sync
  addObject: (obj, emit = true) => {
    set((s) => ({
      history: [...s.history, s.boardObjects],
      boardObjects: [...s.boardObjects, obj],
      redoStack: []
    }));
    if (emit) get().socket?.emit('object-add', obj);
  },

  // Update object and sync
  updateObject: (id, updates, emit = true) => {
    set((s) => ({
      boardObjects: s.boardObjects.map(o => o.id === id ? { ...o, ...updates } : o)
    }));
    if (emit) get().socket?.emit('object-update', { id, updates });
  },

  // Delete object and sync
  deleteObject: (id, emit = true) => {
    set((s) => ({
      history: [...s.history, s.boardObjects],
      boardObjects: s.boardObjects.filter(o => o.id !== id),
      redoStack: []
    }));
    if (emit && get().socket) get().socket.emit('object-delete', id);
  },

  undo: () => set((s) => {
    if (s.history.length === 0) return s;
    const prev = s.history[s.history.length - 1];
    return { boardObjects: prev, history: s.history.slice(0, -1), redoStack: [s.boardObjects, ...s.redoStack] };
  }),

  redo: () => set((s) => {
    if (s.redoStack.length === 0) return s;
    return { history: [...s.history, s.boardObjects], boardObjects: s.redoStack[0], redoStack: s.redoStack.slice(1) };
  }),

  resetBoard: () => set({ boardObjects: [], history: [], redoStack: [], viewport: { x: 0, y: 0, zoom: 1, currentX: 0, currentY: 0 } }),

  initCollaboration: () => {
    // SINGLETON: Prevent multiple connections
    if (get().socket?.connected) return;
    
    const socket = io('http://localhost:4000');

    socket.on('users-update', (users: RemoteUser[]) => {
      set({ others: users.filter(u => u.id !== socket.id) });
    });

    socket.on('cursor-update', (remoteUser: RemoteUser) => {
      set((state) => ({
        others: state.others.map(u => u.id === remoteUser.id ? remoteUser : u)
      }));
    });

    // Object Syncing Listeners
    socket.on('remote-object-add', (newObj: BoardObject) => {
      const alreadyExists = get().boardObjects.some(o => o.id === newObj.id);
      if (!alreadyExists) {
        get().addObject(newObj, false); // emit false to prevent loops
      }
    });

    socket.on('remote-object-update', (data: { id: string, updates: Partial<BoardObject> }) => {
      get().updateObject(data.id, data.updates, false);
    });

    socket.on('remote-object-delete', (id: string) => {
      get().deleteObject(id, false);
    });

    set({ socket });
  },

  // Cleanup to stop ghost collaborators
  terminateCollaboration: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, others: [] });
    }
  },

  broadcastCursor: (x, y) => {
    get().socket?.emit('cursor-move', { x, y });
  },

  broadcastObjectUpdate: (id, updates) => {
    get().socket?.emit('object-update', { id, updates });
  }
}));