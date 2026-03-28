/**
 * Basic tests for the 100 Prisoner Problem solver
 */

const {
  findCycles,
  generateRandomBoxes,
  canSolveWithLoopStrategy,
  runSimulation
} = require('./solver');

describe('100 Prisoner Problem Solver', () => {
  test('should generate boxes of correct length', () => {
    const boxes = generateRandomBoxes(100);
    expect(boxes.length).toBe(100);
    expect(new Set(boxes).size).toBe(100);
  });

  test('should find cycles correctly', () => {
    const boxes = [1, 2, 0, 4, 3]; // 0->1->2->0, 3->4->3
    const result = findCycles(boxes);
    expect(result.cycles.length).toBe(2);
    expect(result.maxCycleSize).toBe(3);
  });

  test('should solve when all cycles <= 50', () => {
    const boxes = Array.from({ length: 100 }, (_, i) => i); // Identity permutation
    const result = canSolveWithLoopStrategy(boxes);
    expect(result.success).toBe(true);
    expect(result.cycleInfo.maxCycleSize).toBe(1);
  });

  test('should run simulation and return statistics', () => {
    const result = runSimulation(100);
    expect(result.totalTrials).toBe(100);
    expect(result.successCount).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(100);
  });

  test('success rate should be in expected range', () => {
    const result = runSimulation(1000);
    // Loop strategy has ~31% success rate
    // With 1000 trials, we expect roughly 310 successes
    // Allow for variance
    expect(result.successRate).toBeGreaterThan(20);
    expect(result.successRate).toBeLessThan(40);
  });
});

module.exports = {
  findCycles,
  generateRandomBoxes,
  canSolveWithLoopStrategy,
  runSimulation
};
