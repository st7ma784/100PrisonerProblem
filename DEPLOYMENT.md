# Deployment Guide

## Overview

This guide covers deploying the 100 Prisoner Problem application in various environments:
- Local development (Docker Compose)
- Kubernetes (Helm chart or kubectl)
- Cloud Platforms (AWS, GCP, Azure)

## Local Development Deployment

### Using Docker Compose

**Prerequisites:**
- Docker 20.10+
- Docker Compose 2.0+

**Start the application:**
```bash
cd /home/user/100PrisonerProblem
docker compose up -d
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost/api
- Nginx proxy: Reverse proxies to backend:3001

**Stop the application:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f prisoner-problem
```

**Rebuild after code changes:**
```bash
docker compose up -d --build
```

### Direct Docker Run

**Build image:**
```bash
docker build -t prisoner-problem:latest .
```

**Run container:**
```bash
docker run -d \
  -p 3000:3001 \
  --name prisoner-demo \
  --health-cmd "curl -f http://localhost:3001/api/health" \
  --health-interval 30s \
  --health-timeout 3s \
  prisoner-problem:latest
```

**Access:**
- http://localhost:3000

**Stop container:**
```bash
docker stop prisoner-demo
docker rm prisoner-demo
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3.0+

### Option 1: Helm Chart (Recommended)

**Install:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace
```

**Verify installation:**
```bash
kubectl get pods -n prisoner-problem
kubectl get svc -n prisoner-problem
```

**Access:**
```bash
# Get the LoadBalancer IP (may take a minute)
kubectl get svc -n prisoner-problem

# Port forward for local testing
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

**Upgrade deployment:**
```bash
helm upgrade prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem
```

**Uninstall:**
```bash
helm uninstall prisoner-problem -n prisoner-problem
```

### Option 2: kubectl Apply

**Deploy:**
```bash
kubectl apply -f helm-chart/prisoner-problem/templates/k8s-manifest.yaml
```

**Verify:**
```bash
kubectl get pods -n prisoner-problem
kubectl get svc -n prisoner-problem
```

**Access:**
```bash
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

**Cleanup:**
```bash
kubectl delete -f helm-chart/prisoner-problem/templates/k8s-manifest.yaml
```

### Kubernetes Configuration

**Replicas:**
- Minimum: 2
- Maximum: 5 (with autoscaling)

**Scaling:**
```bash
# Manual scaling
kubectl scale deployment prisoner-problem -n prisoner-problem --replicas=3

# Check status
kubectl get deployment -n prisoner-problem
```

**Resource Requests/Limits:**
- CPU: 100m request / 500m limit
- Memory: 128Mi request / 512Mi limit

Update in `helm-chart/prisoner-problem/values.yaml`:
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

**Health Checks:**

Liveness probe (restart unhealthy containers):
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10
```

Readiness probe (remove from load balancer):
```yaml
readinessProbe:
  httpGet:
    path: /api/health
    port: 3001
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Local Kubernetes Setup

For development with minikube or kind:

### Minikube

**Start minikube:**
```bash
minikube start --cpus 4 --memory 4096
```

**Use local Docker daemon:**
```bash
eval $(minikube docker-env)
```

**Build image in minikube:**
```bash
docker build -t prisoner-problem:latest .
```

**Deploy:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace
```

**Access:**
```bash
# Method 1: Service nodeport
minikube service prisoner-problem-service -n prisoner-problem

# Method 2: Port forward
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

### Kind

**Create cluster:**
```bash
kind create cluster --name prisoner-dev
```

**Load image into cluster:**
```bash
docker build -t prisoner-problem:latest .
kind load docker-image prisoner-problem:latest --name prisoner-dev
```

**Deploy:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace
```

**Access:**
```bash
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80
```

## Cloud Platform Deployment

### AWS (EKS)

**Prerequisites:**
- AWS CLI configured
- eksctl installed

**Create EKS cluster:**
```bash
eksctl create cluster --name prisoner-problem --region us-east-1 --nodes 3
```

**Push image to ECR:**
```bash
# Create repository
aws ecr create-repository --repository-name prisoner-problem

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag prisoner-problem:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/prisoner-problem:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/prisoner-problem:latest
```

**Deploy with Helm:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace \
  --set image.repository=<account-id>.dkr.ecr.us-east-1.amazonaws.com/prisoner-problem
```

### Google Cloud (GKE)

**Prerequisites:**
- gcloud CLI configured
- kubectl installed

**Create GKE cluster:**
```bash
gcloud container clusters create prisoner-problem \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2
```

**Get credentials:**
```bash
gcloud container clusters get-credentials prisoner-problem --zone us-central1-a
```

**Push to Container Registry:**
```bash
# Configure Docker
gcloud auth configure-docker

# Build and push
docker build -t gcr.io/PROJECT_ID/prisoner-problem:latest .
docker push gcr.io/PROJECT_ID/prisoner-problem:latest
```

**Deploy:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace \
  --set image.repository=gcr.io/PROJECT_ID/prisoner-problem
```

### Azure (AKS)

**Prerequisites:**
- Azure CLI configured

**Create AKS cluster:**
```bash
az aks create \
  --resource-group myResourceGroup \
  --name prisoner-problem \
  --node-count 3
```

**Get credentials:**
```bash
az aks get-credentials \
  --resource-group myResourceGroup \
  --name prisoner-problem
```

**Push to Azure Container Registry:**
```bash
# Create registry
az acr create --resource-group myResourceGroup --name prisonerregistry --sku Basic

# Login
az acr login --name prisonerregistry

# Push image
docker tag prisoner-problem:latest prisonerregistry.azurecr.io/prisoner-problem:latest
docker push prisonerregistry.azurecr.io/prisoner-problem:latest
```

**Deploy:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --create-namespace \
  --set image.repository=prisonerregistry.azurecr.io/prisoner-problem
```

## Image Registry Configuration

### Docker Hub

**Tag image:**
```bash
docker tag prisoner-problem:latest username/prisoner-problem:latest
docker tag prisoner-problem:latest username/prisoner-problem:1.0.0
```

**Push:**
```bash
docker login
docker push username/prisoner-problem:latest
docker push username/prisoner-problem:1.0.0
```

**Deploy from Docker Hub:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --set image.repository=username/prisoner-problem \
  --set image.tag=latest
```

### Private Registry

**Configure Kubernetes secret:**
```bash
kubectl create secret docker-registry regcred \
  --docker-server=myregistry.azurecr.io \
  --docker-username=<username> \
  --docker-password=<password> \
  -n prisoner-problem
```

**Update Helm values:**
```yaml
imagePullSecrets:
  - name: regcred
```

**Deploy:**
```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  --namespace prisoner-problem \
  --set image.repository=myregistry.azurecr.io/prisoner-problem
```

## Monitoring and Logging

### View Logs

**Kubernetes:**
```bash
# Current logs
kubectl logs -n prisoner-problem -l app=prisoner-problem

# Follow logs
kubectl logs -n prisoner-problem -l app=prisoner-problem -f

# Specific pod
kubectl logs -n prisoner-problem <pod-name>

# Previous container logs (after restart)
kubectl logs -n prisoner-problem <pod-name> --previous
```

**Docker:**
```bash
docker logs prisoner-problem -f
```

### Check Health

**Kubernetes:**
```bash
# Check pod status
kubectl get pods -n prisoner-problem -o wide

# Describe pod
kubectl describe pod -n prisoner-problem <pod-name>

# Check events
kubectl get events -n prisoner-problem
```

**Direct HTTP:**
```bash
curl http://localhost:3000/api/health
```

### Scaling Monitoring

**View autoscaler status:**
```bash
kubectl get hpa -n prisoner-problem
```

**Manual metrics check:**
```bash
kubectl top nodes
kubectl top pods -n prisoner-problem
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod -n prisoner-problem <pod-name>

# View logs
kubectl logs -n prisoner-problem <pod-name>

# Check events
kubectl get events -n prisoner-problem
```

### Image Pull Errors

```bash
# Verify image exists
docker image ls prisoner-problem:latest

# Check registry credentials (if private)
kubectl get secrets -n prisoner-problem
```

### Connection Refused

```bash
# Port forward to test
kubectl port-forward -n prisoner-problem svc/prisoner-problem-service 3000:80

# Check service
kubectl get svc -n prisoner-problem

# Check endpoints
kubectl get endpoints -n prisoner-problem
```

### Out of Memory

Increase memory limit in `values.yaml`:
```yaml
resources:
  limits:
    memory: 1Gi
```

Redeploy:
```bash
helm upgrade prisoner-problem ./helm-chart/prisoner-problem -n prisoner-problem
```

## Database (if needed in future)

For PostgreSQL backend:

1. Deploy PostgreSQL to cluster
2. Update backend API to connect
3. Add connection string to ConfigMap/Secret
4. Restart pods to pick up changes

## Backup and Recovery

### Backup Deployment Configuration

```bash
# Backup Helm values
helm get values prisoner-problem -n prisoner-problem > backup-values.yaml

# Backup all resources
kubectl get all -n prisoner-problem -o yaml > backup-resources.yaml
```

### Restore from Backup

```bash
helm install prisoner-problem ./helm-chart/prisoner-problem \
  -n prisoner-problem \
  -f backup-values.yaml
```

## CI/CD Integration

See `.github/workflows/ci-cd.yml` for GitHub Actions pipeline.

Automated:
- Build on push to main/develop
- Run tests
- Build Docker image (optional push on main)
- Validate Helm chart

Manual deployment:
```bash
./deploy.sh latest
```

## Production Checklist

- [ ] Image scanned for vulnerabilities
- [ ] All environment variables set
- [ ] Health checks configured
- [ ] Resource limits set
- [ ] Autoscaling configured
- [ ] Monitoring/logging enabled
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] SSL/TLS certificates ready
- [ ] Load balancer configured
- [ ] Network policies applied
- [ ] RBAC configured
- [ ] Pod security policies applied
- [ ] Rate limiting configured
- [ ] API authentication added
