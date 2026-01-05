import { useState, useEffect, useRef } from 'react';
import type { PuzzlePiece, PuzzleConfig } from '../types';

interface PuzzleBoardProps {
  config: PuzzleConfig;
  pieces: PuzzlePiece[];
  numMissingPieces: number;
}

export function PuzzleBoard({ config, pieces: initialPieces, numMissingPieces }: PuzzleBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState(() => {
    const trayX = config.canvasSize + 50;
    const trayY = 50;

    // Select pieces from the middle area (more likely to be on the circle)
    // Start from index 10 and take numMissingPieces consecutive pieces
    const startIndex = Math.max(0, Math.min(10, initialPieces.length - numMissingPieces));
    const missingPieceIndices = Array.from(
      { length: numMissingPieces },
      (_, i) => startIndex + i
    );

    return initialPieces.map((piece, index) => {
      if (missingPieceIndices.includes(index)) {
        // Place in tray, in a grid layout (3 columns)
        const trayPosition = missingPieceIndices.indexOf(index);
        return {
          ...piece,
          currentX: trayX + (trayPosition % 3) * 70,
          currentY: trayY + Math.floor(trayPosition / 3) * 70,
          isPlaced: false,
        };
      } else {
        return {
          ...piece,
          currentX: piece.correctX,
          currentY: piece.correctY,
          isPlaced: true,
        };
      }
    });
  });
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isSolved, setIsSolved] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    // Track mouse position for tooltip
    setMousePos({ x: e.clientX, y: e.clientY });

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
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Board background */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: config.canvasSize,
          height: config.canvasSize,
          border: '2px solid #667eea',
          borderRadius: '8px',
          background: '#f8f9fa',
          pointerEvents: 'none'
        }} />

        {/* Tray background */}
        <div style={{
          position: 'absolute',
          left: config.canvasSize + 20,
          top: 0,
          width: '260px',
          height: config.canvasSize,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%)',
          borderRadius: '8px',
          border: '2px solid #cbd5e1',
          padding: '16px',
          pointerEvents: 'none'
        }}>
          <h3 style={{
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Storage Tray
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Drop unused pieces here
          </p>
        </div>

        {/* Full area SVG for all pieces */}
        <svg
          width={totalWidth}
          height={config.canvasSize}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'all'
          }}
        >
          {/* Show the FULL background image */}
          <image
            href={config.imageUrl}
            width={config.canvasSize}
            height={config.canvasSize}
            x={0}
            y={0}
          />

          {/* Show WHITE gaps where pieces are missing */}
          {pieces.filter(p => !p.isPlaced).map(piece => (
            <polygon
              key={`gap-${piece.id}`}
              points={piece.polygon.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="white"
              stroke="#cbd5e1"
              strokeWidth={2}
            />
          ))}

          {/* Show draggable pieces (only the ones NOT in correct position) */}
          <defs>
            {pieces.map(piece => (
              <clipPath key={`clip-${piece.id}`} id={`clip-${piece.id}`}>
                <polygon points={piece.polygon.points.map(p => `${p.x},${p.y}`).join(' ')} />
              </clipPath>
            ))}
          </defs>

          {pieces.filter(p => !p.isPlaced).map(piece => (
            <g
              key={piece.id}
              transform={`translate(${piece.currentX - piece.correctX}, ${piece.currentY - piece.correctY})`}
            >
              <image
                href={config.imageUrl}
                width={config.canvasSize}
                height={config.canvasSize}
                x={0}
                y={0}
                clipPath={`url(#clip-${piece.id})`}
                style={{ cursor: isSolved ? 'default' : 'move' }}
                onMouseDown={(e) => !isSolved && handleMouseDown(e as unknown as React.MouseEvent, piece.id)}
              />
              <polygon
                points={piece.polygon.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#667eea"
                strokeWidth={2}
                opacity={0.5}
                pointerEvents="none"
              />
            </g>
          ))}
        </svg>

        {/* Formula tooltip when dragging */}
        {draggedPiece && (() => {
          const piece = pieces.find(p => p.id === draggedPiece);
          const meta = piece?.polygon.metadata;
          if (!meta) return null;

          const PHI = (1 + Math.sqrt(5)) / 2;
          const INV_PHI = 1 / PHI;

          return (
            <div
              style={{
                position: 'fixed',
                left: mousePos.x + 20,
                top: mousePos.y + 20,
                background: 'rgba(102, 126, 234, 0.95)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'monospace',
                pointerEvents: 'none',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                maxWidth: '320px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                🧮 Hat Tiling Formula
              </div>
              <div style={{ lineHeight: '1.6' }}>
                <div><strong>Position:</strong> Row {meta.row}, Col {meta.col}</div>
                <div><strong>Variant:</strong> {meta.variant} (affects angle offset)</div>
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                  <strong>Golden Ratio Offset:</strong>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                  φ = {PHI.toFixed(5)} (golden ratio)
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  1/φ = {INV_PHI.toFixed(5)}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                  offset = ({meta.row} × φ + {meta.col} × 1/φ) mod 1
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  = {meta.fibOffset.toFixed(3)}
                </div>
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                  <strong>Center:</strong> ({meta.centerX.toFixed(1)}, {meta.centerY.toFixed(1)})
                </div>
              </div>
            </div>
          );
        })()}
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
