# Contributing Guide

Thank you for your interest in contributing to the 100 Prisoner Problem project!

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone <your-fork>`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `make install`

## Development Workflow

### Start Development Servers
```bash
make dev
# or manually:
cd backend && npm run dev &
cd frontend && npm start
```

### Code Style
- Use consistent indentation (2 spaces for JavaScript)
- Follow ESLint guidelines
- Write descriptive commit messages

### Testing
```bash
make test
```

### Building
```bash
make build
```

## Areas for Contribution

### Backend
- Additional prisoner strategies
- Performance optimizations
- More comprehensive tests
- API documentation
- Error handling improvements

### Frontend
- UI/UX enhancements
- Accessibility improvements
- Additional visualization types
- Mobile responsiveness refinement
- Performance optimization

### Infrastructure
- Docker optimization
- Kubernetes manifests
- CI/CD pipeline improvements
- Deployment automation
- Monitoring and logging

### Documentation
- Tutorials and guides
- Algorithm explanations
- Deployment documentation
- API reference
- Architecture diagrams

## Pull Request Process

1. **Ensure all tests pass**: `make test`
2. **Build the project**: `make build`
3. **Update documentation** if needed
4. **Create a descriptive PR** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots if UI changes
   - Testing instructions

## Code Review

All PRs are reviewed for:
- Code quality and style consistency
- Test coverage
- Documentation completeness
- Performance impact
- Security considerations

## Reporting Issues

Please report issues with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, version)
- Screenshots or logs if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
