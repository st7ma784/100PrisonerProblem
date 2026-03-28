#!/bin/bash

# Build and deployment script for the 100 Prisoner Problem application

set -e

echo "🏗️  Building 100 Prisoner Problem application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Get version
VERSION="${1:-latest}"
REGISTRY="${2:-}"
IMAGE_NAME="${REGISTRY}prisoner-problem"
FULL_IMAGE="${IMAGE_NAME}:${VERSION}"

echo -e "${BLUE}Building Docker image: ${FULL_IMAGE}${NC}"
docker build -t "${FULL_IMAGE}" .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully: ${FULL_IMAGE}${NC}"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Optionally push to registry
if [ ! -z "$REGISTRY" ]; then
    echo -e "${BLUE}Pushing image to registry...${NC}"
    docker push "${FULL_IMAGE}"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Image pushed successfully${NC}"
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Build complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Usage:"
echo "  Local Development:"
echo "    docker-compose up"
echo ""
echo "  Kubernetes Deployment (Helm):"
echo "    helm install prisoner-problem ./helm-chart/prisoner-problem"
echo ""
echo "  Kubernetes Deployment (kubectl):"
echo "    kubectl apply -f helm-chart/prisoner-problem/templates/k8s-manifest.yaml"
echo ""
