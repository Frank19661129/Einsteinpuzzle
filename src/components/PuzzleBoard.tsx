import { useState, useEffect, useRef } from 'react';
import type { PuzzlePiece, PuzzleConfig } from '../types';

interface PuzzleBoardProps {
  config: PuzzleConfig;
  pieces: PuzzlePiece[];
}

export function PuzzleBoard({ config, pieces: initialPieces }: PuzzleBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState(() => {
    // Start pieces in tray on the right
    const trayX = config.canvasSize + 50;
    return initialPieces.map((piece, index) => ({
      ...piece,
      currentX: trayX + (index % 3) * 80,
      currentY: 20 + Math.floor(index / 3) * 80,
    }));
  });
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const allPlaced = pieces.every(p => p.isPlaced);
    if (allPlaced && pieces.length > 0) {
      setIsSolved(true);
    }
  }, [pieces]);

  const handleMouseDown = (e: React.MouseEvent, pieceId: string) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    setDraggedPiece(pieceId);
    setOffset({
      x: e.clientX - piece.currentX,
      y: e.clientY - piece.currentY
    });

    setPieces(prev => {
      const others = prev.filter(p => p.id !== pieceId);
      return [...others, piece];
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedPiece) return;

    setPieces(prev =>
      prev.map(piece =>
        piece.id === draggedPiece
          ? {
              ...piece,
              currentX: e.clientX - offset.x,
              currentY: e.clientY - offset.y,
              isPlaced: false
            }
          : piece
      )
    );
  };

  const handleMouseUp = () => {
    if (!draggedPiece) return;

    setPieces(prev =>
      prev.map(piece => {
        if (piece.id !== draggedPiece) return piece;

        const distance = Math.sqrt(
          Math.pow(piece.currentX - piece.correctX, 2) +
          Math.pow(piece.currentY - piece.correctY, 2)
        );

        if (distance < config.snapThreshold) {
          return {
            ...piece,
            currentX: piece.correctX,
            currentY: piece.correctY,
            isPlaced: true
          };
        }

        return piece;
      })
    );

    setDraggedPiece(null);
  };

  const handleCheat = () => {
    const animationDuration = 1500;
    const startTime = Date.now();
    const startPositions = pieces.map(p => ({
      id: p.id,
      x: p.currentX,
      y: p.currentY
    }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setPieces(prev =>
        prev.map(piece => {
          const start = startPositions.find(s => s.id === piece.id)!;
          return {
            ...piece,
            currentX: start.x + (piece.correctX - start.x) * eased,
            currentY: start.y + (piece.correctY - start.y) * eased,
            isPlaced: progress === 1,
          };
        })
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Wait for pieces to settle, then mark as solved
        setTimeout(() => {
          setIsSolved(true);
        }, 500);
      }
    };

    animate();
  };

  const totalWidth = config.canvasSize + 300; // Board + tray width

  return (
    <div style={{ position: 'relative', width: totalWidth, margin: '0 auto' }}>
      {/* Main container with board and tray */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: totalWidth,
          height: config.canvasSize,
          display: 'flex',
          gap: '20px'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Puzzle Board */}
        <svg
          width={config.canvasSize}
          height={config.canvasSize}
          style={{
            border: '2px solid #667eea',
            borderRadius: '8px',
            background: '#f8f9fa',
            flexShrink: 0
          }}
        >
          <defs>
            {pieces.map(piece => (
              <clipPath key={`clip-${piece.id}`} id={`clip-${piece.id}`}>
                <polygon points={piece.polygon.points.map(p => `${p.x},${p.y}`).join(' ')} />
              </clipPath>
            ))}
          </defs>

          {pieces.map(piece => (
            <g key={piece.id}>
              <image
                href={config.imageUrl}
                width={config.canvasSize}
                height={config.canvasSize}
                x={piece.currentX - piece.correctX}
                y={piece.currentY - piece.correctY}
                clipPath={`url(#clip-${piece.id})`}
                style={{ cursor: 'move' }}
                onMouseDown={(e) => handleMouseDown(e as unknown as React.MouseEvent, piece.id)}
              />
              {/* Only show borders if not solved */}
              {!isSolved && (
                <polygon
                  points={piece.polygon.points
                    .map(p => `${p.x - piece.correctX + piece.currentX},${p.y - piece.correctY + piece.currentY}`)
                    .join(' ')}
                  fill="none"
                  stroke={piece.isPlaced ? '#10b981' : '#667eea'}
                  strokeWidth={piece.isPlaced ? 3 : 2}
                  opacity={0.5}
                  pointerEvents="none"
                />
              )}
            </g>
          ))}
        </svg>

        {/* Tray on the right */}
        <div style={{
          width: '260px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%)',
          borderRadius: '8px',
          border: '2px solid #cbd5e1',
          padding: '16px',
          position: 'relative'
        }}>
          <h3 style={{
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Puzzle Pieces
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {pieces.filter(p => !p.isPlaced).length} pieces remaining
          </p>
        </div>
      </div>

      {/* Controls below */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handleCheat}
          disabled={isSolved}
          style={{
            padding: '12px 24px',
            background: isSolved ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSolved ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {isSolved ? '✓ Solved!' : '🎯 Solve Puzzle'}
        </button>

        {isSolved && (
          <p style={{
            marginTop: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#10b981'
          }}>
            🎉 Puzzle completed! Oom Arie's circle graph revealed.
          </p>
        )}
      </div>
    </div>
  );
}
