# Makefile for 100 Prisoner Problem

.PHONY: help install dev build run test clean docker-build docker-run deploy-k8s stop

help:
	@echo "100 Prisoner Problem - Makefile Commands"
	@echo "========================================"
	@echo "make install       - Install dependencies"
	@echo "make dev          - Start development servers"
	@echo "make build        - Build production bundles"
	@echo "make test         - Run backend tests"
	@echo "make clean        - Clean build artifacts"
	@echo "make docker-build - Build Docker image"
	@echo "make docker-run   - Run with Docker Compose"
	@echo "make deploy-k8s   - Deploy to Kubernetes"
	@echo "make stop         - Stop running containers"

install:
	npm install
	cd backend && npm install
	cd frontend && npm install

dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:3001"
	@echo "Frontend: http://localhost:3000"
	npm run dev &

build:
	cd backend && npm run build || true
	cd frontend && npm run build

test:
	cd backend && npm test

clean:
	rm -rf backend/dist frontend/build frontend/node_modules backend/node_modules
	find . -name "*.log" -delete

docker-build:
	bash build.sh latest

docker-run:
	docker-compose up --build

docker-stop:
	docker-compose down

deploy-k8s:
	bash deploy.sh latest

lint:
	cd backend && npm run lint || true
	cd frontend && npm run lint || true

.DEFAULT_GOAL := help
