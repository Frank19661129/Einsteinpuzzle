import type { Polygon, Point } from '../types';

// Golden ratio for quasi-periodic distribution
const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

/**
 * Simplified Hat-like Tiling Generator
 *
 * This is a quasi-periodic approximation inspired by the Hat monotile.
 * The true Hat tile discovered by Smith, Myers, Kaplan, and Goodman-Strauss in 2023
 * uses a complex substitution system. For this puzzle MVP, we use a simplified
 * approach with hexagonal variations and golden ratio offsets.
 *
 * Reference: https://github.com/isohedral/hatviz
 */

// Hat monotile info for reference and attribution
export const HAT_INFO = {
  discoverers: ["David Smith", "Joseph Samuel Myers", "Craig S. Kaplan", "Chaim Goodman-Strauss"],
  year: 2023,
  paper: "An aperiodic monotile",
  source: "https://github.com/isohedral/hatviz"
};

export function generateHatTiling(canvasSize: number, complexity: number = 8): Polygon[] {
  const polygons: Polygon[] = [];
  const approxTileSize = canvasSize / complexity;

  for (let row = 0; row < complexity; row++) {
    for (let col = 0; col < complexity; col++) {
      const fibOffset = ((row * PHI + col * INV_PHI) % 1) * approxTileSize * 0.3;
      const centerX = col * approxTileSize + approxTileSize / 2 + fibOffset;
      const centerY = row * approxTileSize + approxTileSize / 2 + fibOffset * 0.7;
      const variant = (row + col) % 3;
      const polygon = createHatLikePolygon(centerX, centerY, approxTileSize * 0.45, variant);

      // Add formula metadata for educational tooltip
      polygon.metadata = {
        row,
        col,
        variant,
        fibOffset,
        centerX,
        centerY,
      };

      polygons.push(polygon);
    }
  }

  return polygons;
}

function createHatLikePolygon(centerX: number, centerY: number, size: number, variant: number): Polygon {
  const points: Point[] = [];
  const numSides = 6;
  const angleOffset = variant * (Math.PI / 6);

  for (let i = 0; i < numSides; i++) {
    const angle = (i * 2 * Math.PI / numSides) + angleOffset;
    const radiusVariation = 1 + (variant === i % 3 ? 0.2 : 0);
    const radius = size * radiusVariation;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }

  return { points };
}

export function clipPolygonToCanvas(polygon: Polygon, _canvasSize: number): Polygon {
  return polygon;
}
