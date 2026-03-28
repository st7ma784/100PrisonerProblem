const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  canSolveWithLoopStrategy,
  generateRandomBoxes,
  runSimulation,
  solveWithCustomStrategy,
  findCycles
} = require('./solver');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate and solve with default strategy
app.post('/api/solve', (req, res) => {
  try {
    const boxes = generateRandomBoxes(100);
    const result = canSolveWithLoopStrategy(boxes);
    
    res.json({
      success: result.success,
      boxes,
      cycleInfo: result.cycleInfo,
      prisonersDetail: result.prisonsSucceed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate multiple trials with default strategy
app.post('/api/simulate', (req, res) => {
  try {
    const { trials = 100 } = req.body;
    
    if (trials < 1 || trials > 10000) {
      return res.status(400).json({ error: 'Trials must be between 1 and 10000' });
    }
    
    const results = runSimulation(trials);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available built-in strategies
app.get('/api/strategies', (req, res) => {
  res.json({
    strategies: [
      {
        id: 'loop-following',
        name: 'Loop Following Strategy',
        description: 'Prisoners follow loops in box numbers. Success if all cycles ≤ 50.',
        successRate: '~31%'
      },
      {
        id: 'random',
        name: 'Random Strategy',
        description: 'Prisoners open random boxes.',
        successRate: '~0.0000000030%'
      },
      {
        id: 'sequential',
        name: 'Sequential Strategy',
        description: 'Prisoners open boxes in order.',
        successRate: 'Very low'
      }
    ]
  });
});

// Test custom strategy
app.post('/api/custom-strategy', (req, res) => {
  try {
    const { trials = 10, strategyCode } = req.body;

    if (!strategyCode) {
      return res.status(400).json({ error: 'Strategy code is required' });
    }

    // Create a safe strategy function from user code
    let strategyFn;
    try {
      // eslint-disable-next-line no-new-func
      strategyFn = new Function('prisoner', 'boxes', 'opensBoxes', 'numberInBox', `return ${strategyCode}`);
    } catch (e) {
      return res.status(400).json({ error: `Invalid strategy code: ${e.message}` });
    }

    let successCount = 0;
    const trialResults = [];

    for (let i = 0; i < trials; i++) {
      const boxes = generateRandomBoxes(100);
      try {
        const result = solveWithCustomStrategy(boxes, strategyFn);
        if (result.success) {
          successCount++;
        }
        trialResults.push({
          trialNum: i + 1,
          success: result.success,
          successfulCount: result.successCount
        });
      } catch (e) {
        return res.status(400).json({ error: `Strategy execution error: ${e.message}` });
      }
    }

    res.json({
      successCount,
      totalTrials: trials,
      successRate: (successCount / trials) * 100,
      trialResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze cycles for visualization
app.post('/api/analyze-boxes', (req, res) => {
  try {
    const { boxes } = req.body;

    if (!boxes || !Array.isArray(boxes) || boxes.length !== 100) {
      return res.status(400).json({ error: 'Boxes must be an array of 100 elements' });
    }

    const result = canSolveWithLoopStrategy(boxes);
    
    res.json({
      success: result.success,
      cycleInfo: result.cycleInfo,
      cyclesToVisualize: result.cycleInfo.cycles.map((cycle, idx) => ({
        cycleId: idx,
        size: cycle.length,
        boxes: cycle,
        color: getColorForCycleSize(cycle.length)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to assign colors based on cycle size
function getColorForCycleSize(size) {
  // Green for safe cycles (≤ 50), red gradient for unsafe ones
  if (size <= 10) return '#2ecc71'; // Green
  if (size <= 25) return '#27ae60'; // Dark green
  if (size <= 50) return '#f39c12'; // Orange
  if (size <= 75) return '#e74c3c'; // Red
  return '#c0392b'; // Dark red
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
