# 100 Prisoner Problem - Interactive K8s Web UI

An interactive web application demonstrating the 100 prisoner problem, including classic variants (benevolent guards, mean wardens, etc.). Fully containerized with Docker and deployable via Kubernetes with Helm.

## Features

- **Visual Loop Representation**: Color-coded visualization of loops in random number boxes showing loop sizes
- **Multiple Problem Variants**: Classic variant, benevolent guards, mean wardens, and more
- **Interactive Strategy Testing**: Try different prisoner strategies and see real-time results
- **Custom Strategy Support**: Users can implement and test their own strategies
- **Statistical Analysis**: Run 100 random trials to view success rate distributions
- **Real-time UI Updates**: Dynamic visualization as strategies are tested

## Project Structure

```
.
├── backend/              # Node.js Express API server
├── frontend/             # React web UI
├── helm-chart/           # Kubernetes Helm deployment chart
├── docker/               # Docker configuration files
└── README.md
```

## Quick Start

### Local Development

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```

### Docker Build

```bash
docker build -t prisoner-problem:latest .
docker run -p 3000:3000 -p 3001:3001 prisoner-problem:latest
```

### Kubernetes Deployment

```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace
```

## The 100 Prisoner Problem

The classic problem: 100 prisoners are numbered 1-100. Each prisoner must open 50 boxes, numbered 1-100, and find their own number. If all prisoners succeed, they're freed. Otherwise, they're all executed.

The twist: Prisoners can see the numbers in all boxes before deciding their strategy, but cannot communicate during the selection process (except through their opening choices).

### Variants

- **Classic**: No communication, truly random box assignments
- **Benevolent Guards**: Guards know optimal strategy and arrange boxes favorably for prisoners
- **Mean Wardens**: Specifically arrange boxes to minimize success probability
- **Other Variants**: Additional strategic constraints

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/solve` - Solve the problem with given strategy
- `POST /api/simulate` - Run 100 trial simulations
- `GET /api/strategies` - List available strategies
- `POST /api/custom-strategy` - Test a custom user-defined strategy

## Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: React, D3.js/Canvas for visualizations
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Helm)

## License

MIT
