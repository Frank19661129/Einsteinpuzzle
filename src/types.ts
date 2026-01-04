export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  points: Point[];
}

export interface PuzzlePiece {
  id: string;
  polygon: Polygon;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  rotation: number;
  isPlaced: boolean;
}

export interface PuzzleConfig {
  imageUrl: string;
  canvasSize: number;
  gridRows: number;
  gridCols: number;
  snapThreshold: number;
}
