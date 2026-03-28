# FAQ & Examples

## Frequently Asked Questions

### General Questions

**Q: What is the 100 Prisoner Problem?**

A: It's a famous probability problem where 100 prisoners must each find their own number among 100 numbered boxes, with each prisoner opening at most 50 boxes. The loop-following strategy has a ~31% success rate, which is surprisingly good compared to random selection (≈1 in 2^100).

**Q: Why is the ~31% success rate so high?**

A: The success probability depends on the permutation cycle structure. The loop-following strategy succeeds if and only if all cycles in the permutation have length ≤ 50. The probability of this is approximately 0.311 - much better than purely random box selection.

**Q: Can I use this in my project?**

A: Yes! It's MIT licensed. Feel free to fork, modify, and use as needed. Attribution is appreciated but not required.

**Q: What variants are supported?**

A: Currently implemented: Loop-following strategy (default). Future variants planned: random strategy, sequential strategy, and configurable benevolent/mean warden arrangements.

---

### Installation & Setup

**Q: I get "Node.js not found" error**

A: Install Node.js from https://nodejs.org/ (18+ recommended). Then try `npm --version` to verify installation.

**Q: npm install takes forever**

A: This is normal the first time - dependencies are large. Subsequent installs will be faster due to caching. You can try `npm ci --prefer-offline` for faster installs if you're behind a proxy.

**Q: How do I fix "port already in use" errors?**

Linux/Mac:
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

Windows:
```cmd
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Or change the ports in `.env` (backend) or `package.json` (frontend).

---

### Development Questions

**Q: How do I debug the backend?**

A:
```bash
# With console logging
console.log('Variable:', myVar);

# With Node debugger
node --inspect src/index.js
# Then visit chrome://inspect in Chrome DevTools
```

**Q: How do I debug the frontend?**

A:
- Press F12 to open Developer Tools
- Use the Console tab for `console.log()` output
- Use the Network tab to see API calls
- Install React DevTools extension for component debugging

**Q: The API is returning errors in production Docker**

A: Check container logs:
```bash
docker logs <container_id>
```

Or in Kubernetes:
```bash
kubectl logs -n prisoner-problem <pod_name>
```

**Q: How do I add a new API endpoint?**

A:
1. Add the function in `backend/src/solver.js`
2. Create a route in `backend/src/index.js`:
```javascript
app.post('/api/my-endpoint', (req, res) => {
  try {
    const result = myFunction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
3. Test with `curl -X POST http://localhost:3001/api/my-endpoint`

**Q: How do I add a new React component?**

A:
1. Create `frontend/src/components/MyComponent.js`
2. Create `frontend/src/components/MyComponent.css`
3. Import in `App.js`: `import MyComponent from './components/MyComponent'`
4. Use in JSX: `<MyComponent prop={value} />`

---

### Docker Questions

**Q: Docker build fails with "npm ERR! code EUSAGE"**

A: The Dockerfile needs package-lock.json files. Run locally first:
```bash
cd backend && npm install
cd ../frontend && npm install
```

Then rebuild Docker image.

**Q: How large is the Docker image?**

A: Approximately 150-200MB due to Node.js + dependencies. Multi-stage build helps minimize size.

**Q: Can I run multiple containers?**

A: Yes! Either with Docker Compose:
```bash
docker-compose up --scale prisoner-problem=3
```

Or with Kubernetes auto-scaling (configured 2-5 pods).

**Q: How do I push to a registry?**

A:
```bash
docker tag prisoner-problem:latest myregistry/prisoner-problem:1.0.0
docker push myregistry/prisoner-problem:1.0.0
```

---

### Kubernetes Questions

**Q: How do I deploy to AWS EKS?**

A:
```bash
# Create cluster
eksctl create cluster --name prisoner-problem

# Push image to ECR
aws ecr create-repository --repository-name prisoner-problem
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/prisoner-problem:latest

# Deploy
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --set image.repository=<account>.dkr.ecr.us-east-1.amazonaws.com/prisoner-problem
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed cloud platform instructions.

**Q: How do I access the application in Kubernetes?**

A:
```bash
# Get LoadBalancer IP (may take a minute)
kubectl get svc -n prisoner-problem

# Or port-forward for local testing
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80

# Then visit http://localhost:3000
```

**Q: How do I scale the deployment?**

A:
```bash
# Manual scaling
kubectl scale deployment prisoner-problem -n prisoner-problem --replicas=5

# Check autoscaling status
kubectl get hpa -n prisoner-problem
```

**Q: How do I update the deployment?**

A:
```bash
# With Helm
helm upgrade prisoner-problem ./helm-chart/prisoner-problem -n prisoner-problem

# With kubectl
kubectl set image deployment/prisoner-problem \
  prisoner-problem=prisoner-problem:1.0.1 -n prisoner-problem
```

---

### API Questions

**Q: What does "success": false mean?**

A: The maximum cycle size exceeded 50, so at least one prisoner couldn't find their number within 50 box openings.

**Q: Can I send custom box configurations?**

A: Yes, use the `/api/analyze-boxes` endpoint:
```bash
curl -X POST http://localhost:3001/api/analyze-boxes \
  -H "Content-Type: application/json" \
  -d '{"boxes": [1, 0, 3, 2, ...]}'
```

**Q: How do I write a custom strategy?**

A:
```bash
curl -X POST http://localhost:3001/api/custom-strategy \
  -H "Content-Type: application/json" \
  -d '{
    "trials": 10,
    "strategyCode": "
      if (opensBoxes.size === 0) {
        return prisoner;
      }
      return numberInBox;
    "
  }'
```

Your function receives: `prisoner`, `boxes`, `opensBoxes`, `numberInBox`
Return the next box to open.

**Q: What if my custom strategy has a bug?**

A: You'll get an error response:
```json
{
  "error": "Strategy execution error: Cannot read property 'size' of undefined"
}
```

Check that you're using the right variable names and types.

---

### Performance Questions

**Q: Why is simulation slow with 10,000 trials?**

A: A single trial requires finding cycles (O(n)) for 100 elements. 10,000 trials might take 5-10 seconds on a single core. This is normal. Consider:
- Using Kubernetes to scale horizontally
- Running multiple simulations in parallel
- Caching results for repeated permutations

**Q: Can I optimize the algorithm?**

A: The cycle detection is already O(n). Potential optimizations:
- Use WebAssembly for compute-heavy tasks
- Implement worker threads for parallel simulations
- Add result caching for identical permutations

**Q: My browser is slow with the visualization**

A: Canvas rendering is optimized but depends on screen size. Try:
- Disabling DevTools
- Closing other browser tabs
- Restarting the browser
- Using a faster machine

---

### Troubleshooting Questions

**Q: "Cannot find module" error**

A: Dependencies not installed. Run:
```bash
npm install
```

In both `backend/` and `frontend/` directories.

**Q: Health check fails in Kubernetes**

A: Check the pod logs:
```bash
kubectl logs -n prisoner-problem <pod-name>
kubectl describe pod -n prisoner-problem <pod-name>
```

Common causes:
- Port mismatch (ensure port 3001)
- Missing environment variables
- Out of memory

**Q: API returns 404**

A: Endpoint doesn't exist. Check the URL matches one of these:
- GET /api/health
- GET /api/strategies
- POST /api/solve
- POST /api/simulate
- POST /api/analyze-boxes
- POST /api/custom-strategy

**Q: React won't compile**

A: Check for syntax errors:
```bash
cd frontend
npm run build
```

Or run with more verbose output:
```bash
npm start -- --verbose
```

---

## Code Examples

### Example 1: Basic API Call (JavaScript)

```javascript
// Fetch and solve once
async function solveProblem() {
  const response = await fetch('/api/solve', { method: 'POST' });
  const data = await response.json();
  
  console.log(`Success: ${data.success}`);
  console.log(`Max Cycle: ${data.cycleInfo.maxCycleSize}`);
  
  if (data.success) {
    console.log('All prisoners found their numbers!');
  }
}

solveProblem();
```

### Example 2: Run Simulation (Python)

```python
import requests
import json

# Run 100 trials
response = requests.post(
    'http://localhost:3001/api/simulate',
    json={'trials': 100}
)

data = response.json()
print(f"Success Rate: {data['successRate']}%")
print(f"Successful: {data['successCount']}/{data['totalTrials']}")
```

### Example 3: Custom Strategy (JavaScript)

```javascript
async function testCustomStrategy() {
  const strategyCode = `
    // Start with prisoner's own number
    if (opensBoxes.size === 0) {
      return prisoner;
    }
    
    // Follow the chain we find
    return numberInBox;
  `;
  
  const response = await fetch('/api/custom-strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trials: 100,
      strategyCode: strategyCode
    })
  });
  
  const data = await response.json();
  console.log(`Strategy success rate: ${data.successRate}%`);
}

testCustomStrategy();
```

### Example 4: Analyze Specific Configuration (Bash)

```bash
#!/bin/bash

# Create a specific permutation
BOXES=$(seq 0 99 | shuf | tr '\n' ',' | sed 's/,$//')

# Analyze it
curl -X POST http://localhost:3001/api/analyze-boxes \
  -H "Content-Type: application/json" \
  -d "{\"boxes\": [$BOXES]}" | jq '.'
```

### Example 5: Docker Compose Override

```yaml
# docker-compose.override.yml (local development)
version: '3.8'

services:
  prisoner-problem:
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug
    volumes:
      - ./backend/src:/app/backend/src  # Hot reload
      - ./frontend/src:/app/frontend/src
    ports:
      - "3001:3001"
```

### Example 6: Kubernetes Debug Pod

```bash
# Deploy a debug pod in the same namespace
kubectl run debug --rm -it --image=alpine -- sh

# From within the pod:
wget -O- http://prisoner-problem-service:3001/api/health
```

### Example 7: Load Testing (ab - Apache Bench)

```bash
# Install if needed: apt-get install apache2-utils

# Test solve endpoint
ab -n 100 -c 10 -p /dev/null -T application/json \
  http://localhost:3001/api/solve

# Results show requests/sec, response times, etc.
```

---

## Common Workflows

### Workflow 1: Making Code Changes

1. Make changes in `backend/src/` or `frontend/src/`
2. Backend: Automatically restarts (nodemon)
3. Frontend: Automatically refreshes (hot module reload)
4. Test changes at http://localhost:3000
5. Commit and push to git

### Workflow 2: Deploying to Production

1. Make and test changes locally
2. Build Docker image: `docker build -t prisoner-problem:1.0.1 .`
3. Push to registry: `docker push myregistry/prisoner-problem:1.0.1`
4. Update Helm chart: `helm upgrade ... --set image.tag=1.0.1`
5. Monitor with: `kubectl get pods -n prisoner-problem`

### Workflow 3: Debugging a Production Issue

1. Check logs: `kubectl logs -n prisoner-problem <pod>`
2. Describe pod: `kubectl describe pod -n prisoner-problem <pod>`
3. Port-forward for testing: `kubectl port-forward ... 3001:3001`
4. Test API manually: `curl http://localhost:3001/api/health`
5. Check resource usage: `kubectl top pods -n prisoner-problem`

### Workflow 4: Adding a New Feature

1. Create feature branch: `git checkout -b feature/my-feature`
2. Implement algorithm changes in `backend/src/solver.js`
3. Add tests in `backend/src/solver.test.js`
4. Add API endpoint in `backend/src/index.js`
5. Create React component in `frontend/src/components/`
6. Update documentation
7. Test locally: `make dev`
8. Push and create PR: `git push origin feature/my-feature`

---

## Getting Help

- **Documentation**: See [README.md](README.md), [DEVELOPMENT.md](DEVELOPMENT.md), [DEPLOYMENT.md](DEPLOYMENT.md), [API.md](API.md)
- **Code Examples**: Check examples in this FAQ
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Community**: Check existing issues before asking

## Report a Bug

When reporting a bug, include:
- What you were trying to do
- What happened instead
- Steps to reproduce
- Environment (OS, Node version, Docker version, etc.)
- Relevant logs or error messages

Example:
```
Title: Docker build fails on Windows
Description: Running `docker build -t prisoner-problem:latest .` fails with npm error

Steps:
1. Clone repo
2. Run `docker build -t prisoner-problem:latest .`
3. See error about npm

Environment:
- Windows 10
- Docker Desktop 4.12
- Git Bash

Error:
```
npm ERR! code EUSAGE
...
```
```

---

## Want to Contribute?

Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines!
