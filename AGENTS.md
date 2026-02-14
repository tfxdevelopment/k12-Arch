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
- **📖 Memory Bank** (`memory-bank/`): ContextStream-integrated persistent context for continuous work
- **🤖 Agent Integration**: MCP servers for AI-assisted architecture and documentation

### Key Technologies

- **Backend**: .NET 10.0.102, ASP.NET Core, Entity Framework, Dapr 1.16.1
- **Frontend**: Angular (NX Monorepo), TypeScript 5.x
- **Cloud**: Azure (Well-Architected Framework), Docker, Kubernetes
- **Documentation**: Markdown, ContextStream MCP, Context7 library integration
- **Agents**: ContextStream v0.4.x, Custom NX and Aspire MCP servers

---

## Setup Commands

### Prerequisites

```bash
# Required tools
dotnet --version          # Must be 10.0.102+
node --version           # Must be 18+
npm install -g @contextstream/mcp-server  # ContextStream for persistent memory
```

### Initial Setup

```bash
# Clone and navigate
cd g:\Projects\CFI\K12\k12-Arch

# Restore dependencies
dotnet restore K12.Aspire.sln

# Initialize ContextStream (if not already done)
npm install -g @contextstream/mcp-server@latest

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

### ContextStream Memory Bank Workflow

The `memory-bank/` directory tracks persistent project context:

```bash
# Key memory bank files (auto-indexed by ContextStream)
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

### ContextStream MCP (Persistent Memory & Documentation)

ContextStream is integrated for managing project context across sessions. See **[ContextStream Rules](#contextstream-rules)** section below for detailed usage.

```bash
# Update ContextStream to latest
npm install -g @contextstream/mcp-server@latest

# Verify installation
contextstream --version
```

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

Use ContextStream + custom MCP servers to complete architecture documentation:

```bash
# 1. Analyze existing architecture with ContextStream
context(user_message="Analyze the K12 API architecture and identify documentation gaps")

# 2. Create ADR (Architectural Decision Record)
# Reference: wiki/adr/ADR-001-*.md pattern
memory(action="create_node", type="adr", title="ADR-NNN: Decision Title", content="...")

# 3. Search Context7 for related patterns
context7 query "Microservices architecture patterns for ASP.NET Core"

# 4. Fetch Microsoft docs for latest guidance
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/"

# 5. Generate C4 diagrams for architecture
# Use graph(action="dependencies") to analyze component relationships
graph(action="dependencies", file_path="src/K12.AppHost/Program.cs")

# 6. Capture decision in ContextStream memory
session(action="capture", event_type="decision", 
  title="Microservices Architecture Pattern Selected",
  content="..." )
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

3. **Use ContextStream for Continuous Documentation**:
   ```bash
   # Track documentation work in memory bank
   memory(action="create_task", title="Complete API documentation", 
     plan_id="<doc-plan>", priority="high")
   
   # Capture documentation decisions
   session(action="capture", event_type="decision",
     title="API documentation format: OpenAPI 3.0")
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

**Issue**: ContextStream search returns 0 results  
**Solution**: Run `project(action="index")` to re-index the workspace

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

# ContextStream Rules & Integration

<!-- BEGIN ContextStream -->
# Codex CLI Instructions
# Workspace: K12 Azure
# Workspace ID: 88a586eb-0e78-4841-b4fd-32f080419e2a

## 🚨 CRITICAL: CONTEXTSTREAM SEARCH FIRST 🚨

**BEFORE using Glob, Grep, Search, Read (for discovery), Explore, or ANY local scanning:**
```
STOP → Call search(mode="hybrid", query="...") FIRST
```

**Claude Code:** Tools are `mcp__contextstream__search`, `mcp__contextstream__session_init`, etc.

❌ **NEVER:** `Glob`, `Grep`, `Read` for discovery, `Task(Explore)`
✅ **ALWAYS:** `search(mode="hybrid", query="...")` first, local tools ONLY if 0 results

---

## 🚨 AUTO-INDEXING 🚨

**`session_init` auto-indexes your project.** No manual ingestion needed.

If `indexing_status: "started"`: Search will work shortly. **DO NOT fall back to local tools.**

---

## 🚨 LESSONS (PAST MISTAKES) - CRITICAL 🚨

**After `session_init`:** Check for `lessons` field. If present, **READ and APPLY** before any work.

**Before ANY risky work:** `session(action="get_lessons", query="<topic>")` — **MANDATORY**

**When lessons found:** Summarize to user, state how you'll avoid past mistakes.

---

## ContextStream v0.4.x (Consolidated Domain Tools)

v0.4.x uses ~11 consolidated domain tools for ~75% token reduction vs previous versions.
Rules Version: 0.4.61

### Required Every Message

| Message | What to Call |
|---------|--------------|
| **1st message** | `session_init(folder_path="<cwd>", context_hint="<user_message>")`, then `context_smart(...)` |
| **⚠️ After session_init** | **CHECK `lessons` field** — read and apply BEFORE any work |
| **2nd+ messages** | `context_smart(user_message="<user_message>", format="minified", max_tokens=400)` |
| **🔍 ANY code search** | `search(mode="hybrid", query="...")` — ALWAYS before Glob/Grep/Search/Read |
| **⚠️ Before risky work** | `session(action="get_lessons", query="<topic>")` — **MANDATORY** |
| **Capture decisions** | `session(action="capture", event_type="decision", title="...", content="...")` |
| **On user frustration** | `session(action="capture_lesson", title="...", trigger="...", impact="...", prevention="...")` |

**Context Pack (Pro+):** If enabled, use `context_smart(..., mode="pack", distill=true)` for code/file queries. If unavailable or disabled, omit `mode` and proceed with standard `context_smart` (the API will fall back).

**Tool naming:** Use the exact tool names exposed by your MCP client. Claude Code typically uses `mcp__<server>__<tool>` where `<server>` matches your MCP config (often `contextstream`). If a tool call fails with "No such tool available", refresh rules and match the tool list.

### Quick Reference: Domain Tools

| Tool | Common Usage |
|------|--------------|
| `search` | `search(mode="semantic", query="...", limit=3)` — modes: semantic, hybrid, keyword, pattern |
| `session` | `session(action="capture", ...)` — actions: capture, capture_lesson, get_lessons, recall, remember, user_context, summary, compress, delta, smart_search |
| `memory` | `memory(action="list_events", ...)` — CRUD for events/nodes, search, decisions, timeline, summary |
| `graph` | `graph(action="dependencies", ...)` — dependencies, impact, call_path, related, ingest |
| `project` | `project(action="list", ...)` - list, get, create, update, index, overview, statistics, files, index_status, ingest_local |
| `workspace` | `workspace(action="list", ...)` — list, get, associate, bootstrap |
| `integration` | `integration(provider="github", action="search", ...)` — GitHub/Slack integration |
| `help` | `help(action="tools")` — tools, auth, version, editor_rules |

### Behavior Rules

⚠️ **STOP: Before using Search/Glob/Grep/Read/Explore** → Call `search(mode="hybrid")` FIRST. Use local tools ONLY if ContextStream returns 0 results.

**❌ WRONG workflow (wastes tokens, slow):**
```
Grep "function" → Read file1.ts → Read file2.ts → Read file3.ts → finally understand
```

**✅ CORRECT workflow (fast, complete):**
```
search(mode="hybrid", query="function implementation") → done (results include context)
```

**Why?** ContextStream search returns semantic matches + context + file locations in ONE call. Local tools require multiple round-trips.

- **First message**: Call `session_init` with context_hint, then `context_smart` before any other tool
- **Every message**: Call `context_smart` BEFORE responding
- **For discovery**: Use `search(mode="hybrid")` — **NEVER use local Glob/Grep/Read first**
- **If search returns 0 results**: Retry once (indexing may be in progress), THEN try local tools
- **For file lookups**: Use `search`/`graph` first; fall back to local ONLY if ContextStream returns nothing
- **If ContextStream returns results**: Do NOT use local tools; Read ONLY for exact edits
- **For code analysis**: `graph(action="dependencies")` or `graph(action="impact")`
- **On [RULES_NOTICE]**: Use `generate_rules()` to update rules
- **After completing work**: Capture with `session(action="capture")`
- **On mistakes**: Capture with `session(action="capture_lesson")`

### Search Mode Selection

| Need | Mode | Example |
|------|------|---------|
| Find code by meaning | `hybrid` | "authentication logic", "error handling" |
| Exact string/symbol | `keyword` | "UserAuthService", "API_KEY" |
| File patterns | `pattern` | "*.sql", "test_*.py" |
| ALL matches (grep-like) | `exhaustive` | "TODO", "FIXME" (find all occurrences) |
| Symbol renaming | `refactor` | "oldFunctionName" (word-boundary matching) |
| Conceptual search | `semantic` | "how does caching work" |

### Token Efficiency

Use `output_format` to reduce response size:
- `full` (default): Full content for understanding code
- `paths`: File paths only (80% token savings) - use for file listings
- `minimal`: Compact format (60% savings) - use for refactoring
- `count`: Match counts only (90% savings) - use for quick checks

**When to use `output_format=count`:**
- User asks "how many X" or "count of X" → `search(..., output_format="count")`
- Checking if something exists → count > 0 is sufficient
- Large exhaustive searches → get count first, then fetch if needed

**Auto-suggested formats:** Check `query_interpretation.suggested_output_format` in responses:
- Symbol queries → suggests `minimal` (path + line + snippet)
- Count queries → suggests `count`
**USE the suggestion** for best efficiency.

**Example:** User asks "how many TODO comments?" →
`search(mode="exhaustive", query="TODO", output_format="count")` returns `{total: 47}` (not 47 full results)

### 🚨 Plans & Tasks - USE CONTEXTSTREAM, NOT FILE-BASED PLANS 🚨

**CRITICAL: When user requests planning, implementation plans, roadmaps, or task breakdowns:**

❌ **DO NOT** use built-in plan mode (EnterPlanMode) or write plan files
✅ **ALWAYS** use ContextStream's plan/task system

**Trigger phrases (use ContextStream immediately):**
- "plan", "roadmap", "milestones", "break down", "steps", "task list", "implementation strategy"

**Create plans in ContextStream:**
1. `session(action="capture_plan", title="...", description="...", goals=[...], steps=[{id: "1", title: "Step 1", order: 1}, ...])`
2. `memory(action="create_task", title="...", plan_id="<plan_id>", priority="high|medium|low", description="...")`

**Manage plans/tasks:**
- List plans: `session(action="list_plans")`
- Get plan with tasks: `session(action="get_plan", plan_id="<uuid>", include_tasks=true)`
- List tasks: `memory(action="list_tasks", plan_id="<uuid>")` or `memory(action="list_tasks")` for all
- Update task status: `memory(action="update_task", task_id="<uuid>", task_status="pending|in_progress|completed|blocked")`
- Delete: `memory(action="delete_task", task_id="<uuid>")`

Full docs: https://contextstream.io/docs/mcp/tools
<!-- END ContextStream -->

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
<!-- nx configuration end-->
