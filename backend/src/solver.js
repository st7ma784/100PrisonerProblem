/**
 * Core solver for the 100 Prisoner Problem
 */

/**
 * Find all cycles in a permutation
 * @param {number[]} boxes - Array where index is prisoner number, value is number in that box
 * @returns {Object} Object with cycles array and cycle sizes
 */
function findCycles(boxes) {
  const n = boxes.length;
  const visited = Array(n).fill(false);
  const cycles = [];

  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;

    const cycle = [];
    let current = start;

    while (!visited[current]) {
      visited[current] = true;
      cycle.push(current);
      current = boxes[current];
    }

    if (cycle.length > 0) {
      cycles.push(cycle);
    }
  }

  return {
    cycles,
    sizes: cycles.map(c => c.length),
    maxCycleSize: Math.max(...cycles.map(c => c.length))
  };
}

/**
 * Check if prisoners can succeed using loop-following strategy
 * Prisoners follow loops in boxes - success if all cycles have size <= 50
 * @param {number[]} boxes - Random box arrangement
 * @returns {Object} Success status and cycle details
 */
function canSolveWithLoopStrategy(boxes) {
  const cycleInfo = findCycles(boxes);
  const success = cycleInfo.maxCycleSize <= 50;

  return {
    success,
    cycleInfo,
    prisonsSucceed: cycleInfo.cycles.map(cycle => {
      return {
        startPrisoner: cycle[0],
        cycleLength: cycle.length,
        success: cycle.length <= 50,
        path: cycle
      };
    })
  };
}

/**
 * Generate a random box arrangement
 * @param {number} n - Number of boxes/prisoners (default 100)
 * @returns {number[]} Random permutation of 0 to n-1
 */
function generateRandomBoxes(n = 100) {
  const boxes = Array.from({ length: n }, (_, i) => i);
  
  // Fisher-Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
  }
  
  return boxes;
}

/**
 * Simulate multiple trials
 * @param {number} trials - Number of trials to run
 * @param {Function} strategyFn - Strategy function (default: loop-following)
 * @returns {Object} Simulation results with statistics
 */
function runSimulation(trials = 100, strategyFn = canSolveWithLoopStrategy) {
  let successCount = 0;
  const results = [];

  for (let i = 0; i < trials; i++) {
    const boxes = generateRandomBoxes(100);
    const result = strategyFn(boxes);
    
    if (result.success) {
      successCount++;
    }
    
    results.push({
      trialNum: i + 1,
      success: result.success,
      maxCycleSize: result.cycleInfo.maxCycleSize
    });
  }

  return {
    successCount,
    totalTrials: trials,
    successRate: (successCount / trials) * 100,
    results
  };
}

/**
 * Custom strategy: Prisoners use a specific opening pattern
 * @param {number[]} boxes - Random box arrangement
 * @param {Function} strategyFn - Custom strategy function that takes boxes and prisoner num
 * @returns {Object} Success status
 */
function solveWithCustomStrategy(boxes, strategyFn) {
  const n = boxes.length;
  const successfulPrisoners = new Set();

  for (let prisoner = 0; prisoner < n; prisoner++) {
    const opensBoxes = new Set();
    let currentBox = strategyFn(prisoner, boxes, opensBoxes);
    let attempts = 0;

    while (!opensBoxes.has(currentBox) && attempts < 50) {
      opensBoxes.add(currentBox);
      const numberInBox = boxes[currentBox];
      
      if (numberInBox === prisoner) {
        successfulPrisoners.add(prisoner);
        break;
      }
      
      currentBox = strategyFn(prisoner, boxes, opensBoxes, numberInBox);
      attempts++;
    }
  }

  return {
    success: successfulPrisoners.size === n,
    successfulPrisoners: Array.from(successfulPrisoners),
    successCount: successfulPrisoners.size,
    totalPrisoners: n
  };
}

module.exports = {
  findCycles,
  canSolveWithLoopStrategy,
  generateRandomBoxes,
  runSimulation,
  solveWithCustomStrategy
};
