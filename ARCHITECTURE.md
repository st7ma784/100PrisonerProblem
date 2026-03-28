# Architecture Documentation

## System Overview

The 100 Prisoner Problem Web UI is a full-stack containerized application with the following components:

### Backend (Node.js/Express)
- **Purpose**: Core algorithm solver and API server
- **Port**: 3001
- **Key Files**:
  - `src/solver.js`: Core 100 prisoner problem algorithm
  - `src/index.js`: Express server and API endpoints
- **API Routes**:
  - `/api/health` - Health check
  - `/api/solve` - Solve with loop strategy
  - `/api/simulate` - Run N trials
  - `/api/strategies` - List available strategies
  - `/api/custom-strategy` - Test user-defined strategy
  - `/api/analyze-boxes` - Analyze box configuration

### Frontend (React)
- **Purpose**: Interactive UI for visualization and strategy testing
- **Port**: 3000
- **Key Components**:
  - `App.js` - Main application container
  - `components/BoxVisualization.js` - Canvas-based visualization
  - `components/StrategyPanel.js` - Strategy testing interface
  - `components/SimulationPanel.js` - 100-trial simulator
  - `components/ResultsDisplay.js` - Results visualization
- **Features**:
  - Real-time visualization of loops with color coding
  - Interactive strategy testing
  - Custom strategy code editor
  - Statistical analysis dashboard

### Containerization
- **Dockerfile**: Multi-stage build
  - Frontend build stage: React app built to static files
  - Backend stage: Node.js dependencies installed
  - Final stage: Combined image with both backend and frontend
- **docker-compose.yml**: Local development setup with optional nginx

### Kubernetes Deployment
- **Helm Chart**: Production-ready Kubernetes deployment
- **Features**:
  - Horizontal Pod Autoscaling (2-5 replicas)
  - Health checks (liveness and readiness probes)
  - Network policies
  - Resource limits
  - Anti-affinity for pod distribution
  - Service LoadBalancer exposure

## Algorithm Overview

### The 100 Prisoner Problem
100 prisoners are numbered 1-100. Each must find their own number in boxes numbered 1-100, with each box containing exactly one number. Each prisoner can open 50 boxes, and all must succeed to escape.

### Loop-Following Strategy
1. Each prisoner starts by opening the box with their number
2. They then open the box containing the number they just found
3. Continue until finding their own number or exceeding 50 box openings
4. Success occurs if all cycles in the permutation have length ≤ 50

### Mathematical Basis
The success probability of the loop-following strategy is:
$$P(\text{success}) = P(\text{all cycles} \leq 50) \approx 0.31 \text{ or } 31\%$$

This is significantly better than random selection which would have probability $\approx 2^{-100}$.

### Cycle Detection
The algorithm identifies all cycles in the permutation:
- Each box leads to exactly one other box
- Cycles form when following this chain returns to the start
- Success requires all cycles to have length ≤ 50

### Visualization Color Coding
- **Green**: Cycles ≤ 10 (very safe)
- **Dark Green**: Cycles 11-25 (safe)
- **Orange**: Cycles 26-50 (acceptable)
- **Red**: Cycles 51-75 (dangerous)
- **Dark Red**: Cycles >75 (failure)

## Data Flow

### Single Solve Request
```
Frontend → POST /api/solve 
    → Backend generates random permutation
    → Find cycles using findCycles()
    → Determine success (all cycles ≤ 50)
    → Return boxes + cycle data
→ Frontend visualizes cycles with colors
```

### Simulation Request
```
Frontend → POST /api/simulate { trials: N }
    → Backend runs N iterations:
        - generate random permutation
        - solve with loop strategy
        - record success/failure
    → Calculate statistics
    → Return results
→ Frontend displays histogram and success rate
```

### Custom Strategy Testing
```
Frontend → POST /api/custom-strategy { code, trials }
    → Backend compiles user code to function
    → Run N trials with user's strategy
    → User function receives:
          - prisoner: current prisoner #
          - boxes: array of box contents
          - opensBoxes: set of opened boxes
          - numberInBox: last found number
    → Track successes and failures
→ Frontend shows results
```

## Performance Considerations

### Backend
- Single-threaded JavaScript execution
- Highly optimized cycle detection O(n)
- Efficient permutation generation
- Can handle 1000+ simulations per request

### Frontend
- Canvas-based rendering for 100 boxes
- Efficient React re-rendering with memoization
- Responsive design adapts to screen size
- Client-side strategy code execution (sandboxed)

### Scaling
- Horizontal pod autoscaling based on CPU usage
- Load balancer distributes requests
- Stateless backend allows concurrent requests
- Each pod is independent

## Future Enhancements

1. **Additional Strategies**:
   - Random box selection strategy
   - Sequential strategy
   - Benevolent guard arrangements
   - Mean warden arrangements

2. **Advanced Visualization**:
   - 3D visualization of cycle structures
   - Animated traversal of prisoner decisions
   - Heat map of cycle densities

3. **Performance Optimization**:
   - WebAssembly for computation-heavy tasks
   - Redis caching for repeated simulations
   - Batch processing for multiple strategies

4. **User Features**:
   - Save and share custom strategies
   - Strategy comparison tool
   - Collaborative problem solving
   - Learning resources and tutorials

5. **Deployment**:
   - Multi-region Kubernetes deployment
   - Prometheus metrics and alerting
   - GraphQL API
   - WebSocket for real-time updates
