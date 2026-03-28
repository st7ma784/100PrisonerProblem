import React, { useEffect, useRef } from 'react';
import './BoxVisualization.css';

/**
 * BoxVisualization Component
 * Renders an interactive grid showing prisoner boxes with loops color-coded by size
 */
function BoxVisualization({ cycleInfo, boxes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!cycleInfo || !boxes || cycleInfo.cycles.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const boxesPerRow = 10;
    const boxSize = 50;
    const gap = 5;
    const padding = 20;

    canvas.width = boxesPerRow * (boxSize + gap) + padding * 2;
    canvas.height = Math.ceil(boxes.length / boxesPerRow) * (boxSize + gap) + padding * 2;

    // Create cycle mapping for each box
    const boxToCycle = {};
    cycleInfo.cycles.forEach((cycle, cycleIdx) => {
      cycle.forEach(boxIdx => {
        boxToCycle[boxIdx] = cycleIdx;
      });
    });

    // Draw boxes
    boxes.forEach((number, boxIdx) => {
      const row = Math.floor(boxIdx / boxesPerRow);
      const col = boxIdx % boxesPerRow;
      const x = padding + col * (boxSize + gap);
      const y = padding + row * (boxSize + gap);

      const cycleIdx = boxToCycle[boxIdx];
      const cycleSize = cycleInfo.cycles[cycleIdx].length;
      const color = getColorForCycleSize(cycleSize);

      // Draw box background
      ctx.fillStyle = color;
      ctx.fillRect(x, y, boxSize, boxSize);

      // Draw box border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxSize, boxSize);

      // Draw box number inside (which prisoner this is)
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Box ${boxIdx}`, x + boxSize / 2, y + boxSize / 2 - 8);

      // Draw number in box (what's inside)
      ctx.fillStyle = '#ddd';
      ctx.font = '10px Arial';
      ctx.fillText(`→ ${number}`, x + boxSize / 2, y + boxSize / 2 + 10);
    });

    // Draw legend
    drawLegend(ctx, canvas.width, cycleInfo.cycles.length);
  }, [cycleInfo, boxes]);

  const drawLegend = (ctx, canvasWidth, cycleCount) => {
    const legendY = canvasWidth + 20;
    const legendItems = [
      { size: '≤10', color: '#2ecc71', label: 'Small (≤10)' },
      { size: '11-25', color: '#27ae60', label: 'Medium (11-25)' },
      { size: '26-50', color: '#f39c12', label: 'Large (26-50)' },
      { size: '51-75', color: '#e74c3c', label: 'Very Large (51-75)' },
      { size: '>75', color: '#c0392b', label: 'Max (>75)' }
    ];

    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Cycle Legend (${cycleCount} cycles total):`, 10, legendY);

    legendItems.forEach((item, idx) => {
      const itemX = 10 + idx * 180;
      ctx.fillStyle = item.color;
      ctx.fillRect(itemX, legendY + 15, 15, 15);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(itemX, legendY + 15, 15, 15);

      ctx.fillStyle = '#333';
      ctx.font = '11px Arial';
      ctx.fillText(item.label, itemX + 20, legendY + 22);
    });
  };

  const getColorForCycleSize = (size) => {
    if (size <= 10) return '#2ecc71'; // Green
    if (size <= 25) return '#27ae60'; // Dark green
    if (size <= 50) return '#f39c12'; // Orange
    if (size <= 75) return '#e74c3c'; // Red
    return '#c0392b'; // Dark red
  };

  return (
    <div className="visualization-container">
      <h2>Box Configuration Visualization</h2>
      <p className="viz-description">
        Each box shows: Box ID (top) and contained number (bottom). Color indicates cycle size.
      </p>
      <canvas ref={canvasRef} className="visualization-canvas" />
      {cycleInfo && (
        <div className="cycle-stats">
          <p>
            <strong>Total Cycles:</strong> {cycleInfo.cycles.length}
          </p>
          <p>
            <strong>Max Cycle Size:</strong> {cycleInfo.maxCycleSize}
          </p>
          <p>
            <strong>Success Threshold:</strong> 50 boxes per prisoner
          </p>
        </div>
      )}
    </div>
  );
}

export default BoxVisualization;
