# Einstein Puzzle - Oom Arie's Aperiodic Jigsaw

An interactive jigsaw puzzle combining mathematical art with aperiodic tiling.

## About

This puzzle is based on a remarkable mathematical visualization created by **Oom Arie**, a 75-year-old mathematician. His work depicts a complete graph K_n drawn on a circle, inspired by the geometric art of **Albert Ernst Bosman** (1891-1961).

The twist: instead of regular puzzle pieces, we use an aperiodic "Einstein" tile—the revolutionary "Hat" monotile discovered in 2023.

## Features

- **Educational start screen** explaining:
  - Oom Arie's complete graph visualization (K_n on a circle)
  - Albert Ernst Bosman's influence
  - Einstein "Hat" aperiodic tiling mathematics
- **Two tiling modes**:
  - Hat Tiling (aperiodic, irregular pieces)
  - Grid Tiling (classic square pieces)
- **Interactive puzzle**:
  - Drag & drop pieces
  - Smart snapping
  - Smooth solve animation
- **No modal on completion** - clean status message

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for Production

```bash
npm run build
```

## Tech Stack

- React + TypeScript
- Vite
- SVG-based rendering with clipPath
- Quasi-periodic golden ratio offsets for Hat-like tiling

## Mathematical Background

- **Complete Graph K_n**: n vertices on a circle, all pairs connected
  - Vertices (V): n
  - Edges (E): n(n−1)/2
  - For n ≈ 40–50: around 780–1,225 chords
- **Hat Monotile**: Aperiodic monotile discovered in 2023
  - No translational symmetry
  - Covers the plane without repeating patterns

## Credits

- **Oom Arie**: Original circle graph visualization
- **Albert Ernst Bosman**: Inspiration (https://alberternstbosman.nl/en/)
- **Hat Monotile**: Smith, Myers, Kaplan, Goodman-Strauss (2023)
  - Source: https://github.com/isohedral/hatviz

## License

Created for Oom Arie's personal enjoyment and mathematical exploration.
