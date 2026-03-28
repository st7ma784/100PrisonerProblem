import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BoxVisualization from './components/BoxVisualization';
import StrategyPanel from './components/StrategyPanel';
import SimulationPanel from './components/SimulationPanel';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [boxes, setBoxes] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('solver');
  const [simulationResults, setSimulationResults] = useState(null);

  const handleGenerateAndSolve = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/solve');
      setResult(response.data);
      setBoxes(response.data.boxes);
    } catch (error) {
      console.error('Error solving:', error);
      alert('Error solving the problem');
    } finally {
      setLoading(false);
    }
  };

  const handleRunSimulation = async (trials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/simulate', { trials });
      setSimulationResults(response.data);
    } catch (error) {
      console.error('Error running simulation:', error);
      alert('Error running simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔒 100 Prisoner Problem Interactive Explorer</h1>
        <p>Visualize loops, test strategies, and explore prisoner escape scenarios</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'solver' ? 'active' : ''}`}
          onClick={() => setActiveTab('solver')}
        >
          Solver
        </button>
        <button
          className={`tab-button ${activeTab === 'strategies' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategies')}
        >
          Strategies
        </button>
        <button
          className={`tab-button ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          Simulation
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'solver' && (
          <div className="tab-content">
            <div className="control-panel">
              <button
                className="primary-button"
                onClick={handleGenerateAndSolve}
                disabled={loading}
              >
                {loading ? 'Solving...' : 'Generate Random Boxes & Solve'}
              </button>
            </div>

            {result && (
              <>
                <BoxVisualization cycleInfo={result.cycleInfo} boxes={result.boxes} />
                <ResultsDisplay result={result} />
              </>
            )}
          </div>
        )}

        {activeTab === 'strategies' && (
          <StrategyPanel boxes={boxes} onTest={handleGenerateAndSolve} />
        )}

        {activeTab === 'simulation' && (
          <SimulationPanel
            onRunSimulation={handleRunSimulation}
            results={simulationResults}
            loading={loading}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>Built with React • Backend: Node.js/Express • Deployed: Docker + Kubernetes</p>
      </footer>
    </div>
  );
}

export default App;
