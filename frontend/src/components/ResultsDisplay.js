import React from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ result }) {
  if (!result) return null;

  const prisonersBySuccess = result.prisonersDetail.filter(p => p.success);
  const prisonersByFailure = result.prisonersDetail.filter(p => !p.success);

  return (
    <div className="results-display">
      <h2>Solution Analysis</h2>

      <div className="results-summary">
        <div className={`summary-card ${result.success ? 'success' : 'failure'}`}>
          <div className="summary-icon">{result.success ? '✓' : '✗'}</div>
          <div className="summary-text">
            <div className="summary-label">{result.success ? 'SOLUTION FOUND' : 'SOLUTION FAILED'}</div>
            <div className="summary-desc">
              {result.success
                ? 'All prisoners successfully found their numbers!'
                : `${prisonersBySuccess.length} prisoners succeeded, ${prisonersByFailure.length} failed`}
            </div>
          </div>
        </div>
      </div>

      <div className="cycle-details">
        <h3>Cycle Information</h3>
        <div className="cycle-stats-grid">
          <div className="cycle-stat">
            <div className="stat-number">{result.cycleInfo.cycles.length}</div>
            <div className="stat-name">Total Cycles</div>
          </div>
          <div className="cycle-stat">
            <div className="stat-number">{result.cycleInfo.maxCycleSize}</div>
            <div className="stat-name">Max Cycle Size</div>
          </div>
          <div className="cycle-stat">
            <div className="stat-number">50</div>
            <div className="stat-name">Max Allowed</div>
          </div>
          <div className="cycle-stat">
            <div className="stat-number">{result.cycleInfo.maxCycleSize <= 50 ? '✓' : '✗'}</div>
            <div className="stat-name">Within Limit</div>
          </div>
        </div>
      </div>

      <div className="prisoners-grid">
        <div className="prisoners-section success-section">
          <h3>✓ Successful Prisoners ({prisonersBySuccess.length})</h3>
          <div className="prisoner-list">
            {prisonersBySuccess.slice(0, 20).map((p, idx) => (
              <div key={idx} className="prisoner-badge success-badge">
                <strong>P{p.startPrisoner}</strong>
                <span className="cycle-length">Cycle: {p.cycleLength}</span>
              </div>
            ))}
            {prisonersBySuccess.length > 20 && (
              <div className="prisoner-more">+{prisonersBySuccess.length - 20} more</div>
            )}
          </div>
        </div>

        {prisonersByFailure.length > 0 && (
          <div className="prisoners-section failure-section">
            <h3>✗ Failed Prisoners ({prisonersByFailure.length})</h3>
            <div className="prisoner-list">
              {prisonersByFailure.slice(0, 20).map((p, idx) => (
                <div key={idx} className="prisoner-badge failure-badge">
                  <strong>P{p.startPrisoner}</strong>
                  <span className="cycle-length">Cycle: {p.cycleLength}</span>
                </div>
              ))}
              {prisonersByFailure.length > 20 && (
                <div className="prisoner-more">+{prisonersByFailure.length - 20} more</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="explanation">
        <h3>How It Works</h3>
        <p>
          The loop-following strategy works because of the permutation structure. Each prisoner starts by opening the box with their own number, then follows the numbers they find. For example:
        </p>
        <ul>
          <li>Prisoner 5 opens box 5, finds number 23</li>
          <li>Prisoner 5 then opens box 23, finds number 8</li>
          <li>Prisoner 5 then opens box 8, finds number 5 (success!)</li>
        </ul>
        <p>
          Success occurs when all cycles in the box permutation have length ≤ 50. This strategy succeeds approximately 31% of the time.
        </p>
      </div>
    </div>
  );
}

export default ResultsDisplay;
