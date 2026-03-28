# Development Guide

## Project Setup

### Prerequisites
- Node.js 18+ 
- npm 8+
- Docker (for containerized development)
- Git

### First-Time Setup

```bash
cd 100PrisonerProblem
bash setup.sh
```

This will:
1. Verify Node.js and npm installation
2. Install root package dependencies
3. Install backend dependencies
4. Install frontend dependencies
5. Create `.env` file for backend

### Directory Structure

```
100PrisonerProblem/
├── backend/                          # Express API server
│   ├── src/
│   │   ├── index.js                 # Express app and endpoints
│   │   ├── solver.js                # Core algorithm
│   │   └── solver.test.js           # Unit tests
│   ├── package.json
│   └── .env.example
├── frontend/                         # React UI
│   ├── src/
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # App styles
│   │   ├── components/
│   │   │   ├── BoxVisualization.js  # Canvas visualization
│   │   │   ├── StrategyPanel.js     # Strategy testing UI
│   │   │   ├── SimulationPanel.js   # Simulation UI
│   │   │   └── ResultsDisplay.js    # Results UI
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
├── helm-chart/                       # Kubernetes Helm chart
│   └── prisoner-problem/
├── .github/workflows/                # CI/CD pipelines
├── Dockerfile                        # Multi-stage Docker build
├── docker-compose.yml                # Local dev setup
├── build.sh                          # Docker build script
├── deploy.sh                         # K8s deployment script
└── setup.sh                          # Project setup script
```

## Development Workflow

### Backend Development

**Start backend with hot reload:**
```bash
cd backend
npm run dev
```

Backend runs on http://localhost:3001

**Run tests:**
```bash
npm test
```

**Project structure:**
```
backend/src/
├── index.js                          # Express server, routes, middleware
├── solver.js                         # Core algorithm implementation
└── solver.test.js                    # Jest unit tests
```

### Frontend Development

**Start development server:**
```bash
cd frontend
npm start
```

Frontend runs on http://localhost:3000 with hot module reloading

**Build for production:**
```bash
npm run build
```

Creates optimized bundle in `build/` directory

**Project structure:**
```
frontend/src/
├── App.js                            # Main container component
├── App.css                           # Root styles
├── components/
│   ├── BoxVisualization.js          # Canvas-based box grid with color-coded cycles
│   ├── BoxVisualization.css
│   ├── StrategyPanel.js             # UI for strategy testing and custom code
│   ├── StrategyPanel.css
│   ├── SimulationPanel.js           # UI for running simulations
│   ├── SimulationPanel.css
│   ├── ResultsDisplay.js            # Results visualization
│   └── ResultsDisplay.css
├── index.js                          # React entry point
└── index.css                         # Global styles
```

## Backend Architecture

### Core Algorithm (solver.js)

#### `findCycles(boxes)`
- **Purpose**: Find all cycles in a permutation
- **Input**: Array of 100 numbers (permutation of 0-99)
- **Returns**: Object with cycles, sizes, and max cycle size
- **Algorithm**: DFS cycle detection
- **Time Complexity**: O(n)

```javascript
const result = findCycles([1, 2, 0, 4, 3]);
// {
//   cycles: [[0,1,2], [3,4]],
//   sizes: [3, 2],
//   maxCycleSize: 3
// }
```

#### `canSolveWithLoopStrategy(boxes)`
- **Purpose**: Check if all prisoners succeed with loop-following strategy
- **Success**: All cycles ≤ 50
- **Returns**: Object with success flag and prisoner details

#### `generateRandomBoxes(n)`
- **Purpose**: Create random permutation using Fisher-Yates shuffle
- **Returns**: Array of n numbers (0 to n-1) in random order

#### `runSimulation(trials, strategyFn)`
- **Purpose**: Run multiple trials and collect statistics
- **Returns**: Success count, rate, and detailed results

#### `solveWithCustomStrategy(boxes, strategyFn)`
- **Purpose**: Execute custom user strategy
- **Strategy Function**: Receives (prisoner, boxes, opensBoxes, numberInBox)
- **Returns**: Success info for the strategy

### Express API (index.js)

Routes implemented:
- `GET /api/health` - Health check
- `POST /api/solve` - Single solve
- `POST /api/simulate` - Run N trials
- `GET /api/strategies` - List strategies
- `POST /api/custom-strategy` - Test custom strategy
- `POST /api/analyze-boxes` - Analyze box config
- Unmatched routes return 404
- Error handler catches exceptions

### Adding New Endpoints

1. **Create new route handler:**
```javascript
app.post('/api/new-endpoint', (req, res) => {
  try {
    // Your logic
    res.json({ result: 'value' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

2. **Test with curl:**
```bash
curl -X POST http://localhost:3001/api/new-endpoint \
  -H "Content-Type: application/json" \
  -d '{"param": "value"}'
```

## Frontend Architecture

### Component Hierarchy

```
App (main container)
├── Tab Navigation
├── Tab Content (one of):
│   ├── Solver Tab
│   │   ├── BoxVisualization (canvas)
│   │   └── ResultsDisplay
│   ├── Strategies Tab
│   │   └── StrategyPanel
│   └── Simulation Tab
│       └── SimulationPanel
└── Footer
```

### Component Responsibilities

**App.js**
- Manages overall application state
- Controls tab navigation
- Handles API calls to backend
- Passes data to child components

**BoxVisualization.js**
- Renders 100 boxes on HTML5 Canvas
- Color codes boxes by cycle size
- Displays legend and cycle statistics
- Responsive to window size

**StrategyPanel.js**
- Shows built-in strategy descriptions
- Provides code editor for custom strategies
- Tests strategies against 100 trials
- Displays success statistics

**SimulationPanel.js**
- Accepts trial count input
- Runs simulation via API
- Shows success rate chart
- Analyzes cycle size distribution

**ResultsDisplay.js**
- Shows overall success/failure
- Lists successful and failed prisoners
- Displays cycle information
- Provides explanation of the strategy

### Styling System

- Global styles in `App.css` and `index.css`
- Component-specific styles in `Component.css`
- Color scheme:
  - Primary: `#667eea` (purple)
  - Success: `#2ecc71` (green)
  - Failure: `#e74c3c` (red)
  - Backgrounds: `#f5f5f5` (light gray)

### Adding New Components

1. **Create component file:**
```javascript
// src/components/MyComponent.js
import React from 'react';
import './MyComponent.css';

function MyComponent({ prop1, prop2 }) {
  return (
    <div className="my-component">
      {/* Component JSX */}
    </div>
  );
}

export default MyComponent;
```

2. **Create styles:**
```css
/* src/components/MyComponent.css */
.my-component {
  /* Your styles */
}
```

3. **Use in App.js:**
```javascript
import MyComponent from './components/MyComponent';

// In JSX:
<MyComponent prop1={value1} prop2={value2} />
```

## Testing

### Backend Tests

Located in `backend/src/solver.test.js`

**Run tests:**
```bash
cd backend
npm test
```

**Add new test:**
```javascript
test('description of what to test', () => {
  const result = functionUnderTest();
  expect(result).toBe(expectedValue);
});
```

### Frontend Testing

React Scripts supports testing. To add tests:

```bash
cd frontend
npm test
```

Test files should be named `*.test.js` and placed in `src/` directory.

## Making Code Changes

### Updating the Algorithm

Edit `backend/src/solver.js`:
```javascript
// Export new functions
module.exports = {
  // ... existing exports
  newFunction: (param) => { /* ... */ }
};
```

### Updating API Routes

Edit `backend/src/index.js`:
```javascript
app.post('/api/new-route', (req, res) => {
  // Implementation
});
```

### Updating UI Components

Edit `frontend/src/components/ComponentName.js`:
- React hot reload will refresh automatically
- Check browser console for errors

### Updating Styles

Edit `CSS` files:
- Changes apply immediately in dev mode
- Remember to maintain responsive design

## Build Process

### Local Development Build

```bash
make build
```

### Docker Build

```bash
./build.sh latest
```

Builds multi-stage Docker image:
1. Frontend stage: Builds React app
2. Backend stage: Installs dependencies
3. Final stage: Combines both

### Production Build

```bash
cd frontend && npm run build
# Creates optimized bundle in build/
```

## Debugging

### Backend Debugging

**Add logging:**
```javascript
console.log('Variable:', variable);
console.error('Error:', error);
```

**Check logs while running:**
```bash
cd backend && npm run dev
# Logs appear in terminal
```

**Debug with Node inspector:**
```bash
node --inspect src/index.js
# Visit chrome://inspect in Chrome DevTools
```

### Frontend Debugging

**React DevTools:**
- Install extension from Chrome Web Store
- Inspect component hierarchy
- Check props and state

**Network tab:**
- F12 or right-click → Inspect
- Go to Network tab
- See API calls to backend

**Console:**
- Check for JavaScript errors
- Log variables with `console.log()`

## Environment Variables

### Backend `.env`

Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
```

### Frontend

Environment variables in `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

Access in React:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## Performance Optimization

### Backend

- Cycle detection is O(n)
- Permutation generation is O(n)
- Simulation memory: O(trials)

Optimization opportunities:
- Cache results for identical permutations
- Use Worker threads for large simulations
- Implement result streaming for long operations

### Frontend

- Canvas rendering is efficient for 100 boxes
- React reconciliation is automatic
- CSS animations use GPU acceleration

Optimization opportunities:
- Memoize expensive computations with `useMemo`
- Use `React.memo` for pure components
- Virtualize large lists if needed

## Common Issues

### Port Already in Use

```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Clean and rebuild
make clean
make build
```

## Code Style

- **JavaScript**: ES6 syntax
- **Indentation**: 2 spaces
- **Naming**: camelCase for variables/functions
- **Comments**: Explain complex logic

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
# Request review and merge
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
