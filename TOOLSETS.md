# K12 Infra Toolsets (Full Bundles)

Comprehensive categorized bundles for platform engineering, GitOps, Terraform/Terramate migration, and Azure operations.

## JSONC

```jsonc
{
  "all-infra-core": {
    "tools": [
      "dotnet-cloud-specialist",
      "dotnet-architect",
      "Terraform Agent",
      "terraform-azurerm-set-diff-analyzer",
      "azure-resource-visualizer",
      "azure-role-selector",
      "dotnet-security-reviewer",
      "dotnet-observability",
      "dotnet-containers",
      "dotnet-container-deployment"
    ],
    "description": "Full-stack infra bundle for platform architecture, Terraform, Azure operations, security, and deployment.",
    "icon": "cloud"
  },

  "gitops-terramate": {
    "tools": [
      "planning-with-files",
      "Terraform Agent",
      "terraform-azurerm-set-diff-analyzer",
      "azure-devops-cli",
      "dotnet-ado-patterns",
      "dotnet-ado-build-test",
      "dotnet-build-analysis",
      "microsoft-docs"
    ],
    "description": "GitOps/Terramate orchestration for changed-stack planning, promotion flow, and operational rollout.",
    "icon": "git-branch"
  },

  "terraform-core": {
    "tools": [
      "Terraform Agent",
      "terraform-azurerm-set-diff-analyzer",
      "project-structure",
      "dotnet-build-analysis",
      "dotnet-build-optimization"
    ],
    "description": "Terraform authoring, structure discipline, validation, and execution troubleshooting.",
    "icon": "server"
  },

  "azure-platform-ops": {
    "tools": [
      "dotnet-cloud-specialist",
      "azure-devops-cli",
      "azure-resource-visualizer",
      "azure-role-selector",
      "dotnet-observability",
      "logging-observability"
    ],
    "description": "Platform operations for Azure resources, RBAC, diagnostics, and observability controls.",
    "icon": "cloud-upload"
  },

  "azure-container-apps-aspire": {
    "tools": [
      "dotnet-cloud-specialist",
      "dotnet-containers",
      "dotnet-container-deployment",
      "aspire-configuration",
      "aspire-service-defaults",
      "dotnet-aspire-patterns",
      "dotnet-observability",
      "dotnet-secrets-management"
    ],
    "description": "Azure Container Apps and Aspire implementation with runtime reliability, secrets, and tracing.",
    "icon": "package"
  },

  "ci-cd-azure-pipelines": {
    "tools": [
      "dotnet-ado-patterns",
      "dotnet-ado-build-test",
      "dotnet-ado-publish",
      "dotnet-build-optimization",
      "dotnet-add-ci",
      "azure-devops-cli"
    ],
    "description": "Azure Pipelines-first CI/CD patterns for build, test, publish, and deployment governance.",
    "icon": "workflow"
  },

  "architecture-design": {
    "tools": [
      "dotnet-architect",
      "dotnet-architecture-patterns",
      "dotnet-domain-modeling",
      "dotnet-solid-principles",
      "project-structure",
      "csharp-wolverinefx",
      "dotnet-mermaid-diagrams"
    ],
    "description": "Architecture and design bundle for domain modeling, patterns, structure, and technical diagrams.",
    "icon": "symbol-structure"
  },

  "security-compliance": {
    "tools": [
      "dotnet-security-reviewer",
      "dotnet-security-owasp",
      "dotnet-cryptography",
      "dotnet-secrets-management",
      "azure-role-selector",
      "data-protection",
      "security-headers"
    ],
    "description": "Security gate for OWASP posture, RBAC, crypto, secrets, and app hardening practices.",
    "icon": "shield"
  },

  "testing-quality": {
    "tools": [
      "dotnet-testing-specialist",
      "dotnet-testing-strategy",
      "dotnet-xunit",
      "dotnet-integration-testing",
      "testcontainers",
      "snapshot-testing",
      "crap-analysis"
    ],
    "description": "Comprehensive quality validation across unit, integration, and risk-based coverage.",
    "icon": "beaker"
  },

  "performance-observability": {
    "tools": [
      "dotnet-performance-analyst",
      "dotnet-profiling",
      "dotnet-benchmarkdotnet",
      "dotnet-performance-patterns",
      "dotnet-gc-memory",
      "dotnet-observability"
    ],
    "description": "Performance tuning with profiling, benchmark design, memory analysis, and telemetry.",
    "icon": "rocket"
  },

  "data-messaging": {
    "tools": [
      "efcore-patterns",
      "database-performance",
      "dotnet-data-access-strategy",
      "dotnet-messaging-patterns",
      "background-services",
      "csharp-wolverinefx"
    ],
    "description": "Data access and async messaging patterns for resilient, event-driven workloads.",
    "icon": "database"
  },

  "api-design-runtime": {
    "tools": [
      "dotnet-minimal-apis",
      "dotnet-api-versioning",
      "dotnet-openapi",
      "dotnet-input-validation",
      "validation-patterns",
      "exception-handling",
      "rate-limiting"
    ],
    "description": "API design/runtime bundle for versioning, contracts, validation, and resilience controls.",
    "icon": "plug"
  },

  "docs-adr": {
    "tools": [
      "dotnet-docs-generator",
      "docfx-specialist",
      "dotnet-api-docs",
      "dotnet-mermaid-diagrams",
      "dotnet-github-docs",
      "dotnet-xml-docs"
    ],
    "description": "Documentation, ADR authoring, and API/reference publishing workflows.",
    "icon": "book"
  },

  "code-quality-modernization": {
    "tools": [
      "dotnet-code-review-agent",
      "dotnet-csharp-code-smells",
      "dotnet-add-analyzers",
      "dotnet-agent-gotchas",
      "slopwatch",
      "dotnet-version-upgrade",
      "dotnet-modernize"
    ],
    "description": "Code quality and modernization set for analyzer-driven cleanup and safe upgrades.",
    "icon": "checklist"
  },

  "agent-customization": {
    "tools": [
      "agent-customization",
      "make-skill-template",
      "skill-creator",
      "planning-with-files",
      "mcp-cli"
    ],
    "description": "Create and maintain custom agents, prompts, instructions, and reusable skills.",
    "icon": "tools"
  },

  "cloud-references": {
    "tools": [
      "microsoft-docs",
      "microsoft-code-reference",
      "azure-resource-visualizer",
      "azure-devops-cli",
      "azure-role-selector"
    ],
    "description": "Reference and discovery bundle for official Microsoft docs, code samples, and Azure resource queries.",
    "icon": "link-external"
  },

  "platform-only": {
    "tools": [
      "dotnet-cloud-specialist",
      "dotnet-architect",
      "Terraform Agent",
      "terraform-azurerm-set-diff-analyzer",
      "azure-resource-visualizer",
      "azure-role-selector",
      "dotnet-security-reviewer"
    ],
    "description": "Least-privilege platform engineering set focused on core/shared/ops infrastructure boundaries.",
    "icon": "organization"
  },

  "release-manager": {
    "tools": [
      "dotnet-ado-patterns",
      "dotnet-ado-build-test",
      "dotnet-ado-publish",
      "azure-devops-cli",
      "planning-with-files",
      "terraform-azurerm-set-diff-analyzer",
      "dotnet-security-reviewer"
    ],
    "description": "Release manager set for promotion gates, deployment evidence, and production readiness checks.",
    "icon": "milestone"
  }
}
```

## Quick picks

- Daily default: `all-infra-core`
- GitOps migration: `gitops-terramate` + `terraform-core`
- Azure pipelines rollout: `ci-cd-azure-pipelines`
- Platform operations: `azure-platform-ops` + `security-compliance`
- App runtime infra: `azure-container-apps-aspire` + `api-design-runtime`
- Quality and modernization: `testing-quality` + `code-quality-modernization`
- Strict platform boundary work: `platform-only`
- Promotion/release control plane: `release-manager`

## Team role matrix

| Role | Primary bundle(s) | Secondary bundle(s) | Typical use |
|---|---|---|---|
| Platform Engineer | `platform-only`, `terraform-core` | `azure-platform-ops`, `security-compliance` | Core/shared/ops module changes, stack boundaries, backend/state hygiene |
| SRE / Operations | `azure-platform-ops`, `performance-observability` | `security-compliance`, `cloud-references` | Reliability, diagnostics, observability tuning, operational guardrails |
| Release Manager | `release-manager`, `ci-cd-azure-pipelines` | `gitops-terramate`, `testing-quality` | Promotion gates, deployment evidence, staged rollout and approvals |
| Security Reviewer | `security-compliance` | `cloud-references`, `code-quality-modernization` | RBAC, secrets handling, OWASP checks, hardening review |
| App Infra Engineer | `azure-container-apps-aspire`, `api-design-runtime` | `data-messaging`, `testing-quality` | App platform wiring, runtime contracts, endpoint and messaging infra |
| Architecture Lead | `architecture-design`, `all-infra-core` | `docs-adr`, `gitops-terramate` | Reference architecture, ADR decisions, migration direction |

### Operating tips

- Start with one **primary** bundle and add one **secondary** only when needed.
- Use `all-infra-core` for discovery, then narrow to role-specific bundles for implementation.
- For production promotions, pair `release-manager` with `security-compliance` before final approval.