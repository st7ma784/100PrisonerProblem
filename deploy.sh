#!/bin/bash

# Deployment script for Kubernetes

set -e

NAMESPACE="prisoner-problem"
RELEASE_NAME="prisoner-problem"
CHART_PATH="./helm-chart/prisoner-problem"
VERSION="${1:-latest}"
IMAGE_TAG="${2:-latest}"

echo "🚀 Deploying 100 Prisoner Problem to Kubernetes..."
echo "  Namespace: $NAMESPACE"
echo "  Release: $RELEASE_NAME"
echo "  Chart: $CHART_PATH"
echo "  Image Tag: $IMAGE_TAG"
echo ""

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo "❌ Helm is not installed. Please install Helm first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy using Helm
echo "📦 Installing Helm release..."
helm upgrade --install $RELEASE_NAME $CHART_PATH \
  --namespace $NAMESPACE \
  --set image.tag=$IMAGE_TAG \
  --set image.pullPolicy=IfNotPresent

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Check deployment status:"
echo "  kubectl get pods -n $NAMESPACE"
echo "  kubectl get svc -n $NAMESPACE"
echo ""
echo "View logs:"
echo "  kubectl logs -n $NAMESPACE -l app=prisoner-problem -f"
echo ""
echo "Access the application:"
echo "  kubectl port-forward -n $NAMESPACE svc/$RELEASE_NAME-service 3000:80 &"
echo "  open http://localhost:3000"
echo ""
