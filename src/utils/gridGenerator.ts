import type { Polygon } from '../types';

export function generateGridPolygons(canvasSize: number, rows: number, cols: number): Polygon[] {
  const polygons: Polygon[] = [];
  const pieceWidth = canvasSize / cols;
  const pieceHeight = canvasSize / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * pieceWidth;
      const y = row * pieceHeight;
      polygons.push({
        points: [
          { x, y },
          { x: x + pieceWidth, y },
          { x: x + pieceWidth, y: y + pieceHeight },
          { x, y: y + pieceHeight }
        ]
      });
    }
  }

  return polygons;
}
