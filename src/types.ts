export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  points: Point[];
  // Formula metadata for hat tiling
  metadata?: {
    row: number;
    col: number;
    variant: number;
    fibOffset: number;
    centerX: number;
    centerY: number;
  };
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
  // Formula metadata for educational tooltip
  formula?: {
    row: number;
    col: number;
    variant: number;
    fibOffset: number;
    centerX: number;
    centerY: number;
  };
}

export interface PuzzleConfig {
  imageUrl: string;
  canvasSize: number;
  gridRows: number;
  gridCols: number;
  snapThreshold: number;
}
