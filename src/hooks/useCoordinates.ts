import { useStore } from '../store/useStore';

export const useCoordinates = () => {
  const viewport = useStore((s) => s.viewport);

  const screenToWorld = (clientX: number, clientY: number) => {
    return {
      x: (clientX - viewport.x) / viewport.zoom,
      y: (clientY - viewport.y) / viewport.zoom,
    };
  };

  return { screenToWorld };
};