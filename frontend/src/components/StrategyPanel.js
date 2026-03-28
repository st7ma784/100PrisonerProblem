import React, { useState } from 'react';
import axios from 'axios';
import './StrategyPanel.css';

function StrategyPanel({ boxes, onTest }) {
  const [customCode, setCustomCode] = useState(
    `// Return next box to open\n// prisoner: current prisoner number\n// boxes: array of box contents\n// opensBoxes: set of already opened box numbers\n// numberInBox: last number found (first call it's undefined)\nreturn prisoner; // Start with prisoner's own number\n`
  );
  const [customResults, setCustomResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [builtInStrategy, setBuiltInStrategy] = useState('loop-following');

  const handleTestCustomStrategy = async () => {
    setTestLoading(true);
    try {
      const response = await axios.post('/api/custom-strategy', {
        trials: 100,
        strategyCode: customCode
      });
      setCustomResults(response.data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestBuiltInStrategy = async () => {
    await onTest();
  };

  return (
    <div className="strategy-panel">
      <div className="strategy-section built-in-strategies">
        <h2>Built-in Strategies</h2>
        <p>Test established prisoner strategies:</p>

        <div className="strategy-list">
          <div className="strategy-card selected">
            <h3>🔄 Loop Following Strategy</h3>
            <p>
              Prisoners follow the numbers in boxes, starting with their own number. Success occurs
              when all prisoners find their numbers within 50 box openings. This has a ~31% success
              rate.
            </p>
            <button className="primary-button" onClick={handleTestBuiltInStrategy}>
              Test Loop Strategy
            </button>
          </div>

          <div className="strategy-card">
            <h3>🎲 Random Strategy</h3>
            <p>
              Prisoners randomly select boxes. Expected success rate: approximately 1 in 2^100
              (virtually impossible).
            </p>
            <button className="secondary-button" disabled>
              Coming Soon
            </button>
          </div>

          <div className="strategy-card">
            <h3>📊 Sequential Strategy</h3>
            <p>Prisoners open boxes sequentially. Very low success rate unless boxes are arranged.</p>
            <button className="secondary-button" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      <div className="strategy-section custom-strategies">
        <h2>Custom Strategy Tester</h2>
        <p>
          Write a custom strategy in JavaScript. The function receives the prisoner number, boxes
          array, and maintains opened boxes. Return the next box number to open.
        </p>

        <div className="code-editor">
          <label>Strategy Function:</label>
          <textarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Enter your strategy code..."
            rows={12}
          />
        </div>

        <div className="editor-info">
          <h4>Available Variables:</h4>
          <ul>
            <li>
              <code>prisoner</code>: Current prisoner number (0-99)
            </li>
            <li>
              <code>boxes</code>: Array where boxes[i] contains number i
            </li>
            <li>
              <code>opensBoxes</code>: Set of box indices already opened
            </li>
            <li>
              <code>numberInBox</code>: Number found in last box opened
            </li>
          </ul>
        </div>

        <button className="primary-button" onClick={handleTestCustomStrategy} disabled={testLoading}>
          {testLoading ? 'Testing...' : 'Test Custom Strategy (100 Trials)'}
        </button>

        {customResults && (
          <div className="results-section">
            <h3>Results</h3>
            <div className="results-stats">
              <div className={`stat-card ${customResults.successCount > 0 ? 'success-green' : 'failure-red'}`}>
                <div className="stat-label">Success Rate</div>
                <div className="stat-value">{customResults.successRate.toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Successful Runs</div>
                <div className="stat-value">
                  {customResults.successCount} / {customResults.totalTrials}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StrategyPanel;
