#!/bin/bash

# Local K8s development setup script
# For use with minikube or kind

set -e

echo "🚀 Setting up local Kubernetes development environment..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running"
    exit 1
fi

# Build image
echo "📦 Building Docker image for local K8s..."
docker build -t prisoner-problem:latest .

# Check for minikube
if command -v minikube &> /dev/null; then
    echo "✓ Found minikube"
    CLUSTER_NAME="minikube"
    
    # Start minikube if not running
    if ! minikube status > /dev/null 2>&1; then
        echo "Starting minikube..."
        minikube start
    fi
    
    # Set Docker environment to use minikube
    echo "Loading image into minikube..."
    minikube image load prisoner-problem:latest
    eval $(minikube docker-env)
    
# Check for kind
elif command -v kind &> /dev/null; then
    echo "✓ Found kind"
    CLUSTER_NAME=$(kind get clusters | head -n1)
    
    if [ -z "$CLUSTER_NAME" ]; then
        echo "Creating kind cluster..."
        kind create cluster
        CLUSTER_NAME=$(kind get clusters | head -n1)
    fi
    
    echo "Loading image into kind cluster..."
    kind load docker-image prisoner-problem:latest --name "$CLUSTER_NAME"
    
else
    echo "❌ Neither minikube nor kind found. Please install one."
    exit 1
fi

echo ""
echo "✅ Deployment ready!"
echo ""
echo "Deploy with:"
echo "  helm install prisoner-problem ./helm-chart/prisoner-problem --namespace prisoner-problem --create-namespace"
echo ""
echo "Or:"
echo "  kubectl apply -f helm-chart/prisoner-problem/templates/k8s-manifest.yaml"
echo ""
