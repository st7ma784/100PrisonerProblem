#!/bin/bash

# Setup script for first-time installation

set -e

echo "🔧 Setting up 100 Prisoner Problem project..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ Node.js and npm are installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo "✓ Dependencies installed"

# Create environment files if they don't exist
echo ""
echo "⚙️  Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend:   cd backend && npm run dev"
echo "  2. Start frontend:  cd frontend && npm start"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
echo ""
echo "Or use Make:"
echo "  make help              - See all commands"
echo "  make dev               - Start development servers"
echo "  make docker-run        - Run with Docker Compose"
echo ""
