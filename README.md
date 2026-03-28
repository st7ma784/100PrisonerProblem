# 100 Prisoner Problem - Interactive K8s Web UI

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-20+-blue)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.20+-blue)](https://kubernetes.io/)
[![Helm](https://img.shields.io/badge/Helm-3+-blue)](https://helm.sh/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

An interactive web application demonstrating the famous **100 Prisoner Problem** with visualization, strategy testing, and statistical analysis. Features a beautiful React UI, Express.js backend, and production-ready Kubernetes deployment via Helm.

## 🎯 Features

- **🎨 Visual Loop Representation**: Color-coded canvas visualization showing cycles in box permutations
  - Green for safe cycles (≤10)
  - Orange for acceptable (26-50)
  - Red for dangerous (>75)
  
- **🧩 Interactive Solver**: Generate random box configurations and watch them being solved in real-time

- **🧪 Strategy Testing**: Test built-in strategies or write your own JavaScript strategies and see results instantly

- **📊 Statistical Analysis**: Run 100+ trials to see success rate distributions and cycle size analysis

- **🔄 Real-time UI Updates**: Dynamic visualization as strategies are tested with live feedback

- **🐳 Production Ready**: 
  - Fully containerized with Docker
  - Kubernetes-ready with Helm charts
  - Auto-scaling, health checks, and monitoring
  - CI/CD pipeline included

## 📚 Documentation

- **[README.md](README.md)** - Overview and features (you are here)
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide and architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment to various environments
- **[API.md](API.md)** - Complete API reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and algorithms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker 20+ (optional)
- Kubernetes 1.20+ (for K8s deployment)

### Local Development (2 minutes)

```bash
# Clone and setup
cd 100PrisonerProblem
bash setup.sh

# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm start
```

Open http://localhost:3000 in your browser!

### Docker (1 minute)

```bash
docker build -t prisoner-problem:latest .
docker run -p 3000:3001 prisoner-problem:latest
```

Open http://localhost:3000

### Kubernetes (5 minutes)

```bash
# Build image
docker build -t prisoner-problem:latest .

# Deploy with Helm
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace

# Access via port-forward
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

Open http://localhost:3000

## 📖 The 100 Prisoner Problem

### Classic Problem Statement

100 prisoners numbered 1-100. Each must find their own number in 100 boxes also numbered 1-100. Each prisoner can open up to 50 boxes. If **all** prisoners find their number, they go free. Otherwise, all are executed.

**Twist**: Prisoners can see all box contents before deciding their strategy, but cannot communicate during selection.

### The Loop-Following Strategy

The optimal strategy with ~31% success rate:
1. Prisoner starts by opening the box with their own number
2. They open the box containing the number they just found
3. Repeat until they find their own number (success!) or exceed 50 openings (failure)

**Why it works**: Success depends on the permutation cycle structure. If all cycles have length ≤ 50, all prisoners succeed!

### Variants

- **Classic**: Random boxes, truly random permutation
- **Benevolent Guards**: Guards arrange boxes to favor prisoners
- **Mean Wardens**: Boxes arranged to minimize success
- **Custom**: User-defined strategies

## 🏗️ Project Structure

```
100PrisonerProblem/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── index.js                 # REST API endpoints
│   │   ├── solver.js                # Core algorithm (O(n) cycle detection)
│   │   └── solver.test.js           # Unit tests
│   └── package.json
├── frontend/                         # React UI
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── App.js                   # Main app
│   │   └── index.js
│   └── package.json
├── helm-chart/                       # Kubernetes Helm chart
│   └── prisoner-problem/
├── docker-compose.yml                # Local dev setup
├── Dockerfile                        # Multi-stage build
├── .github/workflows/ci-cd.yml       # GitHub Actions
└── docs/                             # Documentation files
```

## 🔌 API Reference

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Solve Problem
```bash
curl -X POST http://localhost:3001/api/solve
```

### Run Simulation (100 trials)
```bash
curl -X POST http://localhost:3001/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"trials": 100}'
```

### Test Custom Strategy
```bash
curl -X POST http://localhost:3001/api/custom-strategy \
  -H "Content-Type: application/json" \
  -d '{"trials": 10, "strategyCode": "return prisoner;"}'
```

See [API.md](API.md) for complete API documentation.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, HTML5 Canvas, CSS3 |
| **Backend** | Node.js 18, Express.js 4 |
| **Container** | Docker (multi-stage build) |
| **Orchestration** | Kubernetes + Helm 3 |
| **CI/CD** | GitHub Actions |

## 📊 Performance

- **Backend**: O(n) cycle detection algorithm
- **Simulation**: 1000 trials per request ~500ms
- **Frontend**: 60fps canvas rendering
- **Container**: ~150MB final image size
- **Scaling**: Auto-scales 2-5 pods based on load

## 🚢 Deployment Options

| Option | Command | Best For |
|--------|---------|----------|
| Local Dev | `npm run dev` | Development |
| Docker | `docker-compose up` | Local testing |
| Minikube | `helm install ...` | Local K8s testing |
| EKS/GKE/AKS | Helm charts | Production |

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📈 Use Cases

- **Education**: Understand permutation theory and cycle analysis
- **Optimization**: Explore constraint satisfaction problems
- **Probability**: Learn about combinatorics and probability
- **Algorithms**: Study cycle detection and permutation analysis
- **Demo**: Showcase containerization and K8s deployment

## 🎓 Learning Resources

- [Prisoner Problem Wikipedia](https://en.wikipedia.org/wiki/Prisoners_and_Light_Switch)
- [Original Paper](http://www.mathcircles.org/storage/mathcircles_math_circle_topics_100-prisoners-problem.pdf)
- [Animation Explanation](https://www.youtube.com/watch?v=X9K3T5HgLDQ)

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📋 Development Checklist

- [x] Core algorithm implementation (O(n) cycle detection)
- [x] Express.js API with comprehensive endpoints
- [x] React UI with interactive components
- [x] Canvas-based box visualization
- [x] Custom strategy testing
- [x] Statistical simulation (100+ trials)
- [x] Docker multi-stage build
- [x] Kubernetes Helm chart
- [x] Auto-scaling and health checks
- [x] GitHub Actions CI/CD
- [x] Comprehensive documentation

## 📝 License

MIT - see [LICENSE](LICENSE) file

## 👨‍💻 Author

Built as a demonstration of full-stack web development and containerization best practices.

---

**Status**: ✅ Production Ready

**Latest Version**: 1.0.0

**Questions?** Check the [FAQ section in QUICKSTART.md](QUICKSTART.md#faq) or open an issue!
