import { useState } from 'react';
import type { PuzzleConfig } from './types';
import { PuzzleBoard } from './components/PuzzleBoard';
import { generateGridPolygons } from './utils/gridGenerator';
import { generateHatTiling } from './tiling/hatTiling';
import { createPuzzlePiecesFromPolygons } from './utils/hatPuzzleGenerator';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [tilingMode, setTilingMode] = useState<'hat' | 'grid'>('hat');
  const [numPieces, setNumPieces] = useState<number>(5);

  const config: PuzzleConfig = {
    imageUrl: './oom-arie-circle.png',
    canvasSize: 600,
    gridRows: 4,
    gridCols: 4,
    snapThreshold: 30,
  };

  const startGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('start');
  };

  const polygons = tilingMode === 'hat'
    ? generateHatTiling(config.canvasSize, 6)
    : generateGridPolygons(config.canvasSize, config.gridRows, config.gridCols);

  const pieces = createPuzzlePiecesFromPolygons(polygons);

  return (
    <div className="app">
      <div className="layout-wrapper">
        <aside className="poem-sidebar">
          <div className="poem-content">
            <h3 className="poem-title">Grenswaarden</h3>
            <blockquote className="poem">
              We trekken lijnen in cirkels,<br />
              koorden tussen punten die we tellen,<br />
              zoeken naar patronen<br />
              in wat geen patroon belooft.
              <br /><br />
              Het beste wat we kunnen<br />
              is niet het grootste bereiken,<br />
              maar het ergste voorkomen<br />
              met taal voor wat ertoe doet.
            </blockquote>
            <p className="poem-attribution">
              <em>"Het beste wat we als mens kunnen doen is proberen het ergste te voorkomen."</em>
              <br />
              – W.L. Brugsma
            </p>
          </div>
        </aside>
        <div className="container">
          <header className="header">
            <h1>🧩 Einstein Puzzle</h1>
            <p className="subtitle">Oom Arie's Aperiodic Jigsaw</p>
          </header>

        {gameState === 'start' && (
          <div className="start-screen">
            <div className="card">
              <div className="image-preview">
                <img
                  src="./oom-arie-circle.png"
                  alt="Oom Arie's Circle Graph"
                  style={{ maxWidth: '300px', borderRadius: '8px', marginBottom: '24px' }}
                />
              </div>

              <h2>About This Puzzle</h2>

              <div className="info-block">
                <h3>Oom Arie's Mathematical Figure</h3>
                <p>
                  This puzzle is based on a remarkable mathematical visualization created by <strong>Oom Arie</strong>,
                  a 75-year-old mathematician. His work depicts a <em>complete graph K<sub>n</sub></em> drawn on a circle.
                </p>
                <p>
                  In graph theory, a complete graph connects every pair of <em>n</em> vertices. When arranged on a circle:
                </p>
                <ul>
                  <li><strong>Vertices (V):</strong> n points equally spaced on the circle</li>
                  <li><strong>Edges (E):</strong> n(n−1)/2 connecting lines</li>
                  <li>For n ≈ 40–50: around 780–1,225 chords creating dense, mesmerizing patterns</li>
                </ul>
                <p>
                  The dense intersections create optical "rings" and petal shapes—pure mathematical beauty!
                </p>
              </div>

              <div className="info-block">
                <h3>Inspired by Albert Ernst Bosman</h3>
                <p>
                  Oom Arie's work builds on the mathematical artistry of <strong>Albert Ernst Bosman</strong> (1891–1961),
                  a Dutch artist-mathematician known for his geometric visualizations.
                </p>
                <p>
                  <a
                    href="https://alberternstbosman.nl/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more about Albert Ernst Bosman →
                  </a>
                </p>
              </div>

              <div className="info-block">
                <h3>The Einstein Tiling Twist</h3>
                <p>
                  Instead of cutting the image into regular puzzle pieces, we use an <strong>aperiodic "Einstein" tile</strong>—specifically
                  the "Hat" monotile discovered in 2023 by David Smith, Joseph Samuel Myers, Craig S. Kaplan, and Chaim Goodman-Strauss.
                </p>
                <p>
                  This revolutionary tile covers the plane <em>without ever repeating its pattern</em>—no translational symmetry,
                  making it truly aperiodic.
                </p>
                <p>
                  <a
                    href="https://github.com/isohedral/hatviz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore the Hat monotile →
                  </a>
                </p>
              </div>

              <div className="tiling-selector">
                <h3>Choose Your Puzzle Mode</h3>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tiling"
                    value="hat"
                    checked={tilingMode === 'hat'}
                    onChange={() => setTilingMode('hat')}
                  />
                  <span>🎩 Hat Tiling (Aperiodic, Irregular Pieces)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tiling"
                    value="grid"
                    checked={tilingMode === 'grid'}
                    onChange={() => setTilingMode('grid')}
                  />
                  <span>⬜ Grid Tiling (Classic Square Pieces)</span>
                </label>
              </div>

              <div className="difficulty-selector" style={{ marginTop: '24px' }}>
                <h3>Difficulty Level</h3>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Number of missing pieces:</span>
                    <strong style={{ fontSize: '18px', color: '#667eea' }}>{numPieces}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={numPieces}
                    onChange={(e) => setNumPieces(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Easy (1)</span>
                    <span>Hard (20)</span>
                  </div>
                </label>
              </div>

              <button onClick={startGame} className="primary-button">
                Start Puzzle
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="game-screen">
            <button onClick={resetGame} className="back-button">
              ← Back to Info
            </button>
            <PuzzleBoard config={config} pieces={pieces} numMissingPieces={numPieces} />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
