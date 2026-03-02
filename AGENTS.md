# AGENTS.md - K12 Architecture Documentation & Tools Repository

**Last Updated:** February 7, 2026  
**Workspace ID:** 88a586eb-0e78-4841-b4fd-32f080419e2a

---

## Project Overview

**K12 MyPortal Architecture & Documentation Repository** - Enterprise architecture knowledge base, design patterns, tools, and implementation guidance for .NET Aspire cloud-native applications.

### What This Project Does

This repository maintains:
- **📚 Architecture Knowledge Base** (`wiki/`): LLM-friendly documentation of enterprise patterns, design decisions, and implementation guidance
- **🏗️ Cloud-Native Scaffolding** (`cloud-native-scaffold/`): Docker, Dapr, and Kubernetes-ready templates
- **🛠️ Development Tools** (`tools/`): NX monorepo (frontend), .NET utilities, MCP servers, and documentation sites
- **📖 Memory Bank** (`memory-bank/`): Persistent context for continuous work
- **🤖 Agent Integration**: MCP servers for AI-assisted architecture and documentation

### Key Technologies

- **Backend**: .NET 10.0.102, ASP.NET Core, Entity Framework, Dapr 1.16.1
- **Frontend**: Angular (NX Monorepo), TypeScript 5.x
- **Cloud**: Azure (Well-Architected Framework), Docker, Kubernetes
- **Documentation**: Markdown, Context7 library integration
- **Agents**: Custom NX and Aspire MCP servers

---

## Setup Commands

### Prerequisites

```bash
# Required tools
dotnet --version          # Must be 10.0.102+
node --version           # Must be 18+
```

### Initial Setup

```bash
# Clone and navigate
cd g:\Projects\CFI\K12\k12-Arch

# Restore dependencies
dotnet restore K12.Aspire.sln

# List available Nx projects
nx list
```

### Environment Setup

```bash
# PowerShell setup script (Windows)
.\setup.ps1

# Or manual setup
# 1. Create .env files in relevant project directories
# 2. Configure DAPR_RUNTIME_VERSION=1.16.1 in environment
# 3. Set up Aspire dashboard connection strings
```

---

## Development Workflow

### Start Development Server

```bash
# Method 1: .NET Aspire Watch Mode (recommended)
dotnet watch run --project src/K12.AppHost/K12.AppHost.csproj

# Method 2: Using Nx task
nx run watch

# Method 3: Start individual services
dotnet run --project src/K12.ServiceA/K12.ServiceA.csproj
```

### Aspire Dashboard

The Aspire Dashboard runs on `http://localhost:18888` and shows:
- Service topology and health
- Logs aggregation
- Performance traces
- Resource utilization

### Working with Nx Monorepo (Frontend)

```bash
# Build frontend projects
nx run k12-portal:build
nx affected:build

# Run frontend dev server
nx run k12-portal:serve

# List all projects
nx list

# View project details
nx show project k12-portal
nx show project k12-portal --targets  # Show available targets
```

### Memory Bank Workflow

The `memory-bank/` directory tracks persistent project context:

```bash
# Key memory bank files
memory-bank/projectbrief.md      # Project goals and constraints
memory-bank/productContext.md    # Why this exists, what it solves
memory-bank/systemPatterns.md    # Architecture patterns and decisions
memory-bank/techContext.md       # Technology stack and dependencies
memory-bank/activeContext.md     # Current work focus and decisions
memory-bank/progress.md          # Completed work and next steps
memory-bank/tasks/               # Individual task tracking
```

### Code Organization

- `src/K12.AppHost/` - Aspire orchestration and service configuration
- `src/K12.Api/` - REST APIs (minimal APIs pattern)
- `src/K12.Database.Migrations/` - Entity Framework Core migrations
- `tools/k12-portal/` - Angular frontend (NX monorepo)
- `tools/wiki/` - Architecture and design documentation
- `tools/markdown-site/` - Documentation site generation
- `cloud-native-scaffold/` - Docker and Kubernetes templates

---

## Testing Instructions

### Run All Tests

```bash
# All project tests
dotnet test K12.Aspire.sln /property:GenerateFullPaths=true

# Frontend tests
nx run-many --target=test --all
```

### Run Specific Test Projects

```bash
# Unit tests for a specific service
dotnet test src/K12.Api.Tests/K12.Api.Tests.csproj

# Frontend test for specific project
nx run k12-portal:test

# Watch mode for TDD
nx run k12-portal:test --watch
```

### Test Coverage

```bash
# Generate coverage reports
dotnet test K12.Aspire.sln --collect:"XPlat Code Coverage"
```

### Test Patterns

- **Unit Tests**: `**/*.Tests.cs` - Test individual components in isolation
- **Integration Tests**: `**/Integration/` - Test service integration with dependencies
- **E2E Tests**: `tools/k12-portal/e2e/` - Playwright-based end-to-end tests
- **Performance Tests**: `**/*.Perf.cs` - Performance benchmarks using BenchmarkDotNet

---

## Code Style & Conventions

### C# / .NET Guidelines

- **Target Framework**: .NET 10.0 / .NET Standard 2.0
- **Pattern**: ASP.NET Core minimal APIs (YARP, Clean Architecture)
- **Naming**: PascalCase for types, camelCase for variables
- **Async**: Always use `async`/`await`, avoid `.Result` or `.Wait()`
- **SOLID Principles**: Follow Object Calisthenics for business domain code
- **Comments**: Focus on "why", not "what" (self-documenting code)

### TypeScript / Angular Guidelines

- **Target**: TypeScript 5.x, ES2022 output
- **Style**: RxJS Observables, reactive patterns
- **Components**: Standalone components (Angular 14+)
- **Testing**: Jasmine/Karma (unit), Playwright (E2E)
- **Linting**: ESLint with strict rules, Prettier for formatting

### Documentation

- **README.md**: Human-focused overview and quick start
- **AGENTS.md**: Agent-focused technical context (this file)
- **wiki/**: Architecture decisions, patterns, implementation guides
- **Docstrings**: XML comments for public APIs

### Formatting & Linting

```bash
# .NET formatting (via editorconfig)
dotnet format

# Frontend linting
nx run k12-portal:lint
nx run k12-portal:lint --fix

# Frontend formatting
npx prettier --write "tools/k12-portal/**/*.ts"
```

---

## Build & Deployment

### Build Commands

```bash
# Build entire solution
dotnet build K12.Aspire.sln /property:GenerateFullPaths=true

# Build specific project
dotnet build src/K12.Api/K12.Api.csproj

# Build frontend
nx run k12-portal:build --configuration production

# Publish for deployment
dotnet publish K12.Aspire.sln /property:GenerateFullPaths=true
```

### Generate Aspire Manifest

```bash
# Create docker-compose.yml from Aspire configuration
dotnet run --project src/K12.AppHost -- --output manifest.json
docker-compose -f manifest.yaml up
```

### Docker & Container Deployment

```bash
# Build container images
docker build -f src/K12.Api/Dockerfile -t k12-api:latest .

# Docker Compose (from Aspire manifest)
docker-compose -f cloud-native-scaffold/docker-compose.yml up

# Kubernetes (Aspire to K8s)
dotnet aspire generate --provider kubernetes
```

### Deployment Targets

- **Local**: Docker Desktop, Aspire Dashboard
- **Staging**: Azure Container Instances, App Service
- **Production**: Azure Kubernetes Service (AKS), Container Registry

---

## Pull Request Guidelines

### Title Format

```
[Area] Brief description of change

Examples:
[API] Add user authentication endpoint
[Frontend] Fix responsive layout on mobile
[Docs] Update architecture decision record for caching
[DevOps] Add GitHub Actions CI/CD pipeline
```

### Required Checks Before Submission

```bash
# Run all checks locally
dotnet build K12.Aspire.sln
dotnet test K12.Aspire.sln
dotnet format --verify-no-changes
nx run-many --target=lint --all
nx run-many --target=test --all
nx run-many --target=build --all
```

### Commit Message Conventions

```
<type>(<scope>): <subject>

<body>

<footer>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: api, frontend, infra, docs, tools
Example: fix(api): resolve race condition in user service
```

### Review Requirements

- ✅ All CI checks passing
- ✅ Code coverage maintained or improved
- ✅ Security scanning passed (SAST)
- ✅ Documentation updated if needed
- ✅ Memory bank (activeContext.md, tasks/) updated for significant changes

---

## MCP Servers & Integration

### Context7 MCP (Latest Library Docs)

Context7 provides real-time, up-to-date documentation for libraries and frameworks:

```bash
# Use Context7 to find latest library info
context7 query "React Hooks best practices"
context7 query "Entity Framework Core latest migration patterns"
context7 query "Azure Storage Blobs SDK examples"
```

**Context7 Integration in AGENTS.md**: Use when:
- Resolving library usage questions
- Checking for deprecated APIs
- Finding latest version compatibility info
- Getting code examples for libraries

### Custom MCP Servers

```bash
# NX Workspace MCP (configured in mcp.json)
# Provides nx_workspace, nx_project_details, nx_docs tools

# Aspire CLI MCP
# Provides aspire-specific operations (run, build, manifest generation)

# Microsoft Learn MCP
# Search Microsoft Learn, fetch official docs, and get code samples
```

### Microsoft Learn MCP Usage

```bash
# Search official Microsoft documentation
microsoft_docs_search "Azure Aspire configuration"
microsoft_docs_search ".NET Entity Framework migrations"
microsoft_docs_search "ASP.NET Core minimal APIs"

# Fetch complete documentation pages
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/aspire/"

# Get code samples
microsoft_code_sample_search "Azure Function binding examples"
```

---

## Using MCP for Architecture Documentation

### Documentation Generation Workflow

Use MCP servers and Context7 to complete architecture documentation:

```bash
# 1. Search Context7 for related patterns
context7 query "Microservices architecture patterns for ASP.NET Core"

# 2. Fetch Microsoft docs for latest guidance
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/"

# 3. Create ADR (Architectural Decision Record)
# Reference: wiki/adr/ADR-001-*.md pattern
```

### Completing Architecture Documentation

1. **Wiki Structure** (`tools/wiki/`):
   - `01-architecture/` - System context and container diagrams
   - `02-architecture/` - Component and deployment diagrams
   - `adr/` - Architectural Decision Records
   - `patterns/` - Reusable architectural patterns
   - `standards/` - Team standards and guidelines

2. **Update Documentation Health Report**:
   ```bash
   # Run weekly to identify gaps
   .\scripts\generate-wiki-health-report.ps1
   # Review: wiki/DOCUMENTATION-HEALTH-REPORT.md
   # Review: wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md
   ```

---

## Monorepo Tips

### Working with Frontend (NX Monorepo)

```bash
# Jump to specific project
cd tools/k12-portal
nx show project k12-portal

# Add new package
nx generate @nx/angular:app my-new-app --directory=apps

# Run specific app
nx run k12-portal:serve --port=4200

# View project graph
nx graph

# List all apps, libs, tools
nx list --type=app
nx list --type=lib
```

### Working with Cloud-Native Scaffold

```bash
# Navigate to cloud-native templates
cd cloud-native-scaffold

# Build Dapr components
dapr run --app-id k12-api --app-port 5000 -- dotnet run

# Deploy to Kubernetes
kubectl apply -f k8s-manifests/
```

---

## Debugging & Troubleshooting

### Common Issues

**Issue**: Aspire Dashboard shows "No services"  
**Solution**: Ensure `dotnet watch run` is running from `src/K12.AppHost/`

**Issue**: NX build fails with "Cannot find module"  
**Solution**: Run `npm install` and verify node_modules are present

**Issue**: Database migrations fail  
**Solution**: Update connection strings in environment files, run `dotnet ef database update`

### Logging & Debugging

```bash
# View Aspire logs
# Available in Aspire Dashboard: http://localhost:18888

# View .NET service logs
dotnet run --project src/K12.Api/ --verbosity=diagnostic

# View Frontend logs
nx run k12-portal:serve --log-level=debug

# Enable detailed Dapr logging
dapr run --app-id k12-api --log-level=debug -- dotnet run
```

### Performance Considerations

- Use `nx affected` for incremental builds
- Enable parallel test execution: `dotnet test --parallel`
- Monitor Aspire Dashboard for bottlenecks
- Review C4 diagrams for chatty microservice patterns

---

