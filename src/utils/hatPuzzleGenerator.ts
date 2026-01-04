import type { PuzzlePiece, Polygon } from '../types';

export function createPuzzlePiecesFromPolygons(polygons: Polygon[]): PuzzlePiece[] {
  return polygons.map((polygon, index) => {
    const centroid = calculateCentroid(polygon);
    return {
      id: `piece-${index}`,
      polygon,
      correctX: centroid.x,
      correctY: centroid.y,
      currentX: 0, // Will be set by PuzzleBoard to tray position
      currentY: 0,
      rotation: 0,
      isPlaced: false,
    };
  });
}

function calculateCentroid(polygon: Polygon): { x: number; y: number } {
  const { points } = polygon;
  const sum = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}
