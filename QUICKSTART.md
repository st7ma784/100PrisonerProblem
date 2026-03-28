# 100 Prisoner Problem - Quick Start Guide

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized development)

### Development Setup

1. **Clone and install dependencies:**
```bash
cd 100PrisonerProblem
npm install
```

2. **Start the backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

3. **Start the frontend (new terminal):**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

4. **Open browser:**
Navigate to `http://localhost:3000`

### Docker Setup

Build and run with Docker Compose:
```bash
docker-compose up --build
```

Access the application at `http://localhost`

## Kubernetes Deployment

### Prerequisites
- Docker
- Kubernetes cluster (minikube, kind, or cloud provider)
- Helm 3+
- kubectl configured

### Build Docker Image

```bash
./build.sh latest my-registry/
```

Or manually:
```bash
docker build -t prisoner-problem:latest .
docker push my-registry/prisoner-problem:latest
```

### Deploy with Helm

```bash
./deploy.sh latest
```

Or manually:
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace \
  --set image.tag=latest
```

### Access Deployed Application

```bash
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

Then visit `http://localhost:3000`

### Monitor Deployment

```bash
# Check pods
kubectl get pods -n prisoner-problem

# View logs
kubectl logs -n prisoner-problem -l app=prisoner-problem -f

# Get service info
kubectl get svc -n prisoner-problem
```

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Solve Problem
```bash
POST /api/solve
# Returns: solved box configuration with cycle analysis
```

### Run Simulation
```bash
POST /api/simulate
# Body: { "trials": 100 }
# Returns: success statistics from multiple trials
```

### Get Built-in Strategies
```bash
GET /api/strategies
```

### Test Custom Strategy
```bash
POST /api/custom-strategy
# Body: { "trials": 10, "strategyCode": "return prisoner;" }
# Returns: success rate for custom strategy
```

### Analyze Boxes
```bash
POST /api/analyze-boxes
# Body: { "boxes": [...] }
# Returns: cycle data for visualization
```

## File Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server
│   │   └── solver.js         # Core 100 prisoner problem logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React app
│   │   ├── components/       # React components
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── helm-chart/
│   └── prisoner-problem/      # Kubernetes Helm chart
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Local development setup
├── build.sh                   # Build script
└── deploy.sh                  # K8s deployment script
```

## Features

- **Loop Visualization**: Color-coded representation of cycles in box permutations
- **Interactive Testing**: Test strategies and see real-time results
- **Custom Strategies**: Write and test your own prisoner strategies
- **Statistical Analysis**: Run 100+ trials and analyze success rates
- **Responsive UI**: Works on desktop and tablet
- **Production Ready**: Containerized, horizontally scalable, with health checks

## Theoretical Background

The 100 Prisoner Problem involves finding the optimal strategy for prisoners to find their numbers in boxes. The loop-following strategy (where prisoners follow the numbers they find) has approximately a 31% success rate, which is much better than random selection.

This application visualizes the cycle structure that underlies this strategy's effectiveness.

## License

MIT
