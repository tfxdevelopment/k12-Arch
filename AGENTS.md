## .NET Skill Library

You have access to a comprehensive .NET skill library. Use these skills for any C#/.NET development work. Always prefer skill-guided patterns over pre-training knowledge.

### Skill Routing by Task Type

**Writing C# Code:**
- `csharp-coding-standards` - General C# coding standards and conventions
- `dotnet-csharp-modern-patterns` - Records, pattern matching, primary constructors, and modern C# language features
- `csharp-concurrency-patterns` - Choosing between async/await, Channels, locks, synchronization primitives
- `csharp-api-design` - API surface design, versioning, backward compatibility
- `csharp-type-design-performance` - Sealed classes, readonly structs, Span<T>, Memory<T>

**Roslyn, Code Generation, and Analyzer Authoring:**
- `dotnet-roslyn-analyzers` - Authoring analyzers, code fixes, refactorings, suppressors, packaging, and tests
- `dotnet-csharp-source-generators` - Incremental source generators and compile-time code generation
- `dotnet-add-analyzers` - Consuming/configuring analyzer packages and rule sets
- `dotnet-api-surface-validation` - API compatibility and breaking-change guardrails in CI

**Entity Framework Core:**
- `efcore-patterns` - DbContext lifecycle, NoTracking, query splitting, migrations, interceptors
- `database-performance` - N+1 prevention, read/write separation, query optimization

**ASP.NET Core Web:**
- `middleware-patterns` - Pipeline ordering, custom middleware, exception handling
- `razor-pages-patterns` - Page models, validation, anti-forgery, routing
- `validation-patterns` - FluentValidation, DataAnnotations, custom validators
- `exception-handling` - ProblemDetails, global handlers, error responses
- `caching-strategies` - Output caching, Redis, HybridCache (.NET 9+)
- `rate-limiting` - Request throttling, sliding window, concurrency limits
- `security-headers` - CSP, HSTS, CORS, security middleware

**Background Processing:**
- `background-services` - BackgroundService, IHostedService, outbox pattern, graceful shutdown
- `dotnet-channels` - Producer/consumer, bounded channels, backpressure

**Dependency Injection:**
- `microsoft-extensions-dependency-injection` - Service lifetimes, keyed services, factory patterns
- `microsoft-extensions-configuration` - IOptions, configuration providers, secrets

**Testing:**
- `dotnet-testing-strategy` - Test pyramid, unit vs integration decisions
- `dotnet-xunit` - xUnit patterns, fixtures, theory data
- `testcontainers` - Docker-based integration tests, database fixtures
- `snapshot-testing` - Verify library, approval testing
- `dotnet-playwright` - E2E browser testing
- `crap-analysis` - CRAP scores, coverage analysis

**Performance:**
- `dotnet-benchmarkdotnet` - Benchmark design, measurement methodology
- `dotnet-performance-patterns` - Allocation reduction, GC optimization
- `dotnet-profiling` - Profiler usage, hotspot identification
- `dotnet-gc-memory` - GC modes, memory pressure, Large Object Heap

**Native AOT:**
- `dotnet-native-aot` - AOT compilation, publishing, constraints
- `dotnet-trimming` - Size optimization, linker configuration
- `dotnet-aot-wasm` - WASM AOT with Blazor

**Security:**
- `dotnet-security-owasp` - OWASP Top 10 for .NET
- `dotnet-cryptography` - Encryption, hashing, key management
- `dotnet-secrets-management` - Secret storage, Azure Key Vault, user secrets
- `asp-net-core-identity-patterns` - Authentication, authorization, MFA

**UI Frameworks:**
- `dotnet-blazor-patterns` - Server/WASM/Hybrid patterns
- `dotnet-blazor-components` - Component lifecycle, rendering
- `dotnet-maui-development` - Cross-platform mobile/desktop
- `dotnet-winui` - Windows App SDK, WinUI 3
- `razor-pages-patterns` - Server-side web UI

**CI/CD:**
- `dotnet-gha-patterns` - GitHub Actions workflow patterns
- `dotnet-gha-build-test` - Build/test matrix, caching
- `dotnet-gha-publish` - NuGet, container publishing
- `dotnet-ado-patterns` - Azure DevOps pipelines

**Architecture:**
- `dotnet-architecture-patterns` - Clean architecture, vertical slice, modular monolith
- `dotnet-solid-principles` - SOLID in practice
- `dotnet-domain-modeling` - DDD patterns, aggregates
- `project-structure` - Solution layout, Directory.Build.props

**Deployment:**
- `fly-io` - Fly.io deployment, Machines, Volumes, networking
- `dotnet-containers` - Docker for .NET
- `dotnet-container-deployment` - Container orchestration

**Specialized Frameworks:**
- `csharp-wolverinefx` - Messaging, HTTP services, Marten event sourcing
- `aspire-configuration` - .NET Aspire AppHost configuration
- `aspire-integration-testing` - Aspire testing patterns
- `signalr-integration` - Real-time communication

**Migration & Refactoring (Azure Functions -> Web API + CQRS):**
- `csharp-wolverinefx` - CQRS messaging, handlers, and Wolverine migration patterns
- `dotnet-architecture-patterns` - Vertical slices and modular architecture decisions
- `dotnet-minimal-apis` - Endpoint migration patterns for modern ASP.NET Core APIs
- `dotnet-testing-strategy` - Safe incremental migration testing strategy
- `dotnet-xunit` - Implementation tests and regression coverage

### Meta-Skills (Run After Changes)

- `slopwatch` - Detect LLM-generated anti-patterns
- `dotnet-agent-gotchas` - Common AI mistakes in .NET
- `dotnet-build-analysis` - Build output analysis

### Agent Activation

For complex domain-specific tasks, consider activating a specialist agent:
- `docfx-specialist` - DocFX docs authoring, markdownlint, build validation
- `dotnet-architect` - Framework and architecture recommendations based on project context
- `dotnet-aspnetcore-specialist` - Middleware, request pipeline, minimal API and DI analysis
- `dotnet-async-performance-specialist` - Async/await performance, ValueTask, ThreadPool, Channels
- `dotnet-benchmark-designer` - BenchmarkDotNet methodology and benchmark correctness
- `dotnet-blazor-specialist` - Blazor hosting/render-mode/component guidance
- `dotnet-cloud-specialist` - Aspire, AKS/ACA deployment, CI/CD, observability
- `dotnet-code-review-agent` - Broad triage across correctness/performance/security/architecture
- `dotnet-concurrency-specialist` - General threading/race/deadlock analysis
- `dotnet-csharp-concurrency-specialist` - C# concurrency bug diagnosis and synchronization issues
- `dotnet-docs-generator` - README/docs generation, XML docs, architecture diagrams
- `dotnet-maui-specialist` - MAUI architecture, platform targeting, Native AOT guidance
- `dotnet-performance-analyst` - Profiling output and bottleneck analysis
- `dotnet-security-reviewer` - Security review, OWASP, secrets and crypto misuse
- `dotnet-testing-specialist` - Test architecture, strategy, and quality gates
- `dotnet-uno-specialist` - Uno cross-platform architecture and target guidance
- `Roslyn Debt Modernizer` - Tech debt modernization using Roslyn + migration from Azure Functions to Web API + CQRS/Wolverine
- `Roslyn Rule Factory` - Authoring analyzers, code fixes, refactorings, suppressors, and test/package scaffolding

### Agent-Specific Skill Pairings

Use these pairings to keep custom agents focused and consistent:

- `Roslyn Debt Modernizer`
	- `dotnet-roslyn-analyzers`
	- `csharp-wolverinefx`
	- `dotnet-architecture-patterns`
	- `dotnet-minimal-apis`
	- `dotnet-testing-strategy`
	- `dotnet-xunit`

- `Roslyn Rule Factory`
	- `dotnet-roslyn-analyzers`
	- `dotnet-csharp-source-generators`
	- `dotnet-add-analyzers`
	- `dotnet-testing-strategy`
	- `dotnet-xunit`
	- `dotnet-api-surface-validation`

- `dotnet-architect`
	- `dotnet-advisor`
	- `dotnet-version-detection`
	- `dotnet-project-analysis`
	- `dotnet-architecture-patterns`

- `dotnet-aspnetcore-specialist`
	- `dotnet-minimal-apis`
	- `middleware-patterns`
	- `dotnet-resilience`
	- `dotnet-http-client`
	- `microsoft-extensions-dependency-injection`

- `dotnet-testing-specialist`
	- `dotnet-testing-strategy`
	- `dotnet-xunit`
	- `dotnet-integration-testing`
	- `testcontainers`
	- `dotnet-playwright`

- `dotnet-performance-analyst`
	- `dotnet-profiling`
	- `dotnet-benchmarkdotnet`
	- `dotnet-performance-patterns`
	- `dotnet-observability`

- `dotnet-cloud-specialist`
	- `aspire`
	- `aspire-configuration`
	- `dotnet-containers`
	- `dotnet-container-deployment`
	- `dotnet-observability`

- `dotnet-code-review-agent`
	- `csharp-coding-standards`
	- `dotnet-csharp-modern-patterns`
	- `dotnet-csharp-async-patterns`
	- `dotnet-csharp-dependency-injection`
	- `dotnet-csharp-nullable-reference-types`
	- `dotnet-csharp-code-smells`

- `dotnet-async-performance-specialist`
	- `dotnet-profiling`
	- `dotnet-performance-patterns`
	- `dotnet-channels`
	- `dotnet-csharp-async-patterns`

- `dotnet-security-reviewer`
	- `dotnet-security-owasp`
	- `dotnet-secrets-management`
	- `dotnet-cryptography`

- `dotnet-docs-generator`
	- `dotnet-documentation-strategy`
	- `dotnet-mermaid-diagrams`
	- `dotnet-xml-docs`
	- `dotnet-github-docs`

### Command Workflows (.github/commands)

Use these command prompts for consistent execution workflows:

- `architecture-create.md` / `architecture-review.md` - Use-case architecture planning and final review
- `code-use-case.md` / `code-review.md` - Implementation execution and post-implementation review
- `test-verify-backend.md` / `test-verify-ui.md` - Pre-deployment verification gates
- `deploy.md` / `deploy-review.md` - Deployment execution and post-deployment retrospective
- `git-commit.md` - Conventional commit workflow
- `use-case-create.md` / `use-case-review.md` - Use-case discovery/authoring and refinement review
- `prompt-improvement.md` - Post-session prompt/process optimization review