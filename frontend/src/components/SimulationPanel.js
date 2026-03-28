import React, { useState } from 'react';
import './SimulationPanel.css';

function SimulationPanel({ onRunSimulation, results, loading }) {
  const [trials, setTrials] = useState(100);

  const handleRunSimulation = () => {
    onRunSimulation(trials);
  };

  return (
    <div className="simulation-panel">
      <div className="simulation-setup">
        <h2>100 Prisoner Problem Simulator</h2>
        <p>Run multiple trials to see the success rate of the loop-following strategy.</p>

        <div className="simulation-controls">
          <div className="control-group">
            <label htmlFor="trials-input">Number of Trials:</label>
            <input
              id="trials-input"
              type="number"
              min="1"
              max="10000"
              value={trials}
              onChange={(e) => setTrials(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
              disabled={loading}
            />
          </div>

          <button className="primary-button" onClick={handleRunSimulation} disabled={loading}>
            {loading ? 'Simulating...' : `Run ${trials} Trials`}
          </button>
        </div>
      </div>

      {results && (
        <div className="simulation-results">
          <h2>Simulation Results</h2>

          <div className="results-statistics">
            <div className={`stat-card ${results.successCount > 0 ? 'success-green' : 'failure-red'}`}>
              <div className="stat-label">Success Rate</div>
              <div className="stat-value">{results.successRate.toFixed(2)}%</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Successful Runs</div>
              <div className="stat-value">{results.successCount}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Failed Runs</div>
              <div className="stat-value">{results.totalTrials - results.successCount}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Trials</div>
              <div className="stat-value">{results.totalTrials}</div>
            </div>
          </div>

          <div className="results-chart">
            <h3>Success Distribution</h3>
            <div className="bar-chart">
              <div className="bar-container">
                <div className="bar-label">Success</div>
                <div className="bar success-bar" style={{ width: `${Math.max(3, (results.successCount / results.totalTrials) * 100)}%` }}>
                  {results.successCount}
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-label">Failure</div>
                <div className="bar failure-bar" style={{ width: `${Math.max(3, ((results.totalTrials - results.successCount) / results.totalTrials) * 100)}%` }}>
                  {results.totalTrials - results.successCount}
                </div>
              </div>
            </div>
          </div>

          <div className="cycle-size-analysis">
            <h3>Max Cycle Sizes in Trials</h3>
            <p>Distribution of maximum cycle sizes across trials:</p>
            <div className="analysis-grid">
              {analyzeMaxCycleSizes(results.results).map((item, idx) => (
                <div key={idx} className="analysis-item">
                  <div className="range">{item.range}</div>
                  <div className="count">{item.count} trials</div>
                </div>
              ))}
            </div>
          </div>

          <div className="theoretical-note">
            <h4>Theoretical Background</h4>
            <p>
              The loop-following strategy has a success probability of approximately 31%. This is derived from the probability that all cycles in a random permutation of 100 elements have length ≤ 50.
            </p>
          </div>
        </div>
      )}

      {!results && !loading && (
        <div className="no-results">
          <p>Click "Run Trials" above to start a simulation.</p>
        </div>
      )}
    </div>
  );
}

function analyzeMaxCycleSizes(results) {
  const ranges = [
    { min: 1, max: 10, label: '1-10' },
    { min: 11, max: 25, label: '11-25' },
    { min: 26, max: 50, label: '26-50' },
    { min: 51, max: 75, label: '51-75' },
    { min: 76, max: 100, label: '76-100' }
  ];

  return ranges.map(range => ({
    range: range.label,
    count: results.filter(r => r.maxCycleSize >= range.min && r.maxCycleSize <= range.max).length
  }));
}

export default SimulationPanel;
