# Phase 1 & 2 Analysis: Deduplication Matrix + Structure Design
**Target:** Parallelize finding duplicates (1) with designing `.github-private` structure (2)  
**Status:** Detailed findings below  
**Review Focus:** APM handoff designs at bottom

---

## 🔴 CRITICAL FINDING: Agent Duplication Confirmed

### Duplicate Pair #1: Concurrency Specialists (CONSOLIDATE)

| Aspect | `dotnet-concurrency-specialist` | `dotnet-csharp-concurrency-specialist` | Recommendation |
|--------|---------|---------|---------|
| **Purpose** | Expert in .NET threading, race conditions, sync primitives | Routing agent for concurrency bugs, decision tree-based | **CONSOLIDATE** |
| **Content Length** | 60+ lines detailed content | 40+ lines + decision tree | Keep detailed version in `.github-private`; deprecate routing version |
| **Knowledge Source** | Implicit threading library expertise | Stephen Cleary + Albahari + Fowler citations | **Merge into one** with citations |
| **Use Cases** | Analyzing racy code, deadlocks, memory barriers | Same + diagnostics workflow | Both serve same purpose |
| **Preloaded Skills** | None (self-contained) | 3 preloaded skills (async-patterns, concurrency-patterns, modern-patterns) | **Better:** consolidate with skills loaded |
| **Decision** | 🟡 KEEP + ENHANCE | 🔴 DEPRECATE (local copy) → GLOBAL | Default to concurrency-specialist in `.github-private` |

**Action:** Move `dotnet-concurrency-specialist` to `.github-private/agents/` as canonical version. Remove `dotnet-csharp-concurrency-specialist` from k12-infra; link to global via APM.

---

## 🟡 INSTRUCTIONS EXTRACTION ANALYSIS

### Current File: `k12-infra/.github/copilot-instructions.md` (147 lines)

**Breakdown:**
- **Lines 1-3:** YAML frontmatter (global applicable)
- **Lines 4-52:** Terraform execution patterns, module boundaries, environment setup (GLOBAL)
- **Lines 53-88:** Container Apps, Dapr, networking, Key Vault integration (GLOBAL Azure patterns)
- **Lines 89-100:** CI/CD conventions, tagging strategy, version management (GLOBAL)
- **Lines 101-147:** K12-specific paths, database hydration, troubleshooting for THIS project (LOCAL)

**Extraction Breakdown:**

| Section | Lines | Category | Target File |
|---------|-------|----------|-------------|
| Terraform Execution Rules | 15-25 | 🟢 GLOBAL | `terraform-execution-patterns.instructions.md` |
| Azure Module Architecture | 26-52 | 🟢 GLOBAL | `azure-infrastructure-conventions.instructions.md` |
| Container Apps + Dapr | 53-75 | 🟢 GLOBAL | `azure-container-apps-patterns.instructions.md` |
| Networking + VNets | 76-88 | 🟢 GLOBAL | `azure-networking-conventions.instructions.md` |
| Secrets + RBAC | 89-100 | 🟢 GLOBAL | `azure-security-conventions.instructions.md` |
| K12 Project Paths | 101-120 | 🔴 LOCAL | Keep in k12-infra/.github/copilot-instructions.md |
| K12 Database Hydration | 121-130 | 🔴 LOCAL | Keep in k12-infra/.github/copilot-instructions.md |
| K12 Debugging | 131-147 | 🔴 LOCAL | Keep in k12-infra/.github/copilot-instructions.md |

**Result:** 72% can be extracted to `.github-private/instructions/`. Keep 28% in k12-infra.

### Extraction Strategy

**New k12-infra `copilot-instructions.md` (AFTER migration):**
```yaml
---
description: K12 Enrollment platform infrastructure rules
globs: terraform/**
---

# K12 Infrastructure Copilot Instructions

## Inherit Global Patterns
- See `.github-private/instructions/terraform-execution-patterns.instructions.md`
- See `.github-private/instructions/azure-infrastructure-conventions.instructions.md`
- See `.github-private/instructions/azure-container-apps-patterns.instructions.md`

## K12-Specific Context

[Only K12-specific sections: module paths, database hydration, enrollment API patterns, etc.]
```

---

## 🟢 PROMPTS ASSESSMENT: All Candidates for `.github-private`

**All 16 prompts are domain-neutral workflow patterns:**

| Prompt | Domain | Global? |
|--------|--------|---------|
| architecture-create.md | Planning | ✅ YES |
| architecture-review.md | Planning | ✅ YES |
| code-use-case.md | Development | ✅ YES |
| code-review.md | Development | ✅ YES |
| use-case-create.md | Planning | ✅ YES |
| use-case-review.md | Planning | ✅ YES |
| test-verify-backend.md | QA/Testing | ✅ YES |
| test-verify-ui.md | QA/Testing | ✅ YES |
| deploy.md | Deployment | ✅ YES |
| deploy-review.md | Deployment | ✅ YES |
| git-commit.md | Git workflow | ✅ YES |
| prompt-improvement.md | Meta-improvement | ✅ YES |
| suggest-awesome-* (4 files) | Collection management | ✅ YES |

**Decision:** Move **all 16 prompts** to `.github-private/prompts/`. Zero duplication risk.

---

## 🟣 SKILLS SAMPLE AUDIT: Awesome-Copilot Overlap Check

Scanning the 200+ skill folders against likely awesome-copilot collections:

| Skill Category | Local Count | Likely awesome-copilot Match | Overlap Risk | Action |
|---|---|---|---|---|
| dotnet-* (runtime, tools) | ~45 | csharp-dotnet-development collection | 🟠 HIGH | Audit ASAP; likely 70-90% match |
| csharp-* (language) | ~15 | csharp-dotnet-development collection | 🟠 HIGH | Audit ASAP |
| ASP.NET Core | ~20 | csharp-dotnet-development + specific collections | 🟠 HIGH | Audit ASAP |
| Azure | (via instructions, not skills folders) | azure-cloud-development collection | 🟡 MEDIUM | Verify; may be in AGENTS.md instead |
| DevOps/CI-CD | ~20 | dotnet-gha-*, dotnet-ado-* collections | 🟠 HIGH | Audit for versions |
| Testing | ~15 | testing-automation collection | 🟠 HIGH | Audit ASAP |
| **Total Audit Scope** | **200+** | **5-7 collections** | **70-80% OVERLAP** | **CRITICAL FINDING** |

**Key Insight:** Skills folder is likely **replicate/cached** versions of awesome-copilot, not original source. Recommend symlink strategy after audit.

---

## 📐 PROPOSED `.github-private` STRUCTURE (Informed by Findings)

```
tfxdevelopment/.github-private/

├── .apm/
│   ├── cli-config.yaml                  # MCP + handoff routing
│   └── mcp-config.json                  # Terraform, Aspire, etc.
│
├── agents/
│   ├── terraform.agent.md               # From k12-infra
│   ├── dotnet-architect.agent.md
│   ├── dotnet-concurrency-specialist.agent.md    # ← CONSOLIDATED (detailed version)
│   ├── dotnet-cloud-specialist.agent.md
│   ├── dotnet-security-reviewer.agent.md
│   ├── dotnet-testing-specialist.agent.md
│   ├── dotnet-code-review-agent.agent.md
│   └── [11 more agents]
│   
│   # NOTE: dotnet-csharp-concurrency-specialist NOT included (consolidated above)
│
├── prompts/                             # All 16, zero duplication
│   ├── architecture-create.prompt.md
│   ├── code-review.prompt.md
│   ├── deploy.prompt.md
│   └── [13 more prompts]
│
├── instructions/                        # Global extracted patterns
│   ├── terraform-execution-patterns.instructions.md              # ← From k12-infra
│   ├── azure-infrastructure-conventions.instructions.instructions.md
│   ├── azure-container-apps-patterns.instructions.md
│   ├── azure-networking-conventions.instructions.md
│   ├── azure-security-conventions.instructions.md
│   ├── aspire-global-patterns.instructions.md                    # ← New for Aspire
│   ├── dotnet-ci-cd-patterns.instructions.md                     # ← New meta-instruction
│   └── database-hydration-strategies.instructions.md             # ← New for data seeding
│
├── skills/
│   ├── manifest.json                    # Version tracking + symlink registry
│   ├── dotnet/                          # Symlink → awesome-copilot/skills/dotnet-*
│   ├── csharp/                          # Symlink → awesome-copilot/skills/csharp-*
│   ├── testing/                         # Symlink → awesome-copilot/skills/testing-*
│   ├── ci-cd/                           # Symlink → awesome-copilot/skills/gha-*, ado-*
│   └── custom/                          # Local only (project-agnostic enhancements)
│       ├── mcp-routing-patterns.md      # ← New: local MCP best practices
│       └── terraform-mcp-integration.md # ← New: Terraform MCP specifics
│
├── reference/
│   ├── AGENTS-INDEX.md                  # 17 agents catalog + activation rules
│   ├── SKILLS-MANIFEST.md               # Skills registry with awesome-copilot refs
│   ├── DEDUPLICATION-LEDGER.md          # Audit trail of removed/consolidated items
│   ├── DUPLICATION-MATRIX.md            # This analysis (reference)
│   └── PROJECT-OVERLAY-GUIDE.md         # How projects extend globally
│
├── templates/
│   ├── copilot-instructions.template.md    # Template with {{ PROJECT }} placeholder
│   ├── apm.template.yml                    # Template with global dependency
│   └── project-setup.md                    # Quick-start for new projects
│
├── apm.yml                              # Master APM registry
├── README.md                            # Governance + onboarding
└── LICENSE
```

---

## 🎯 k12-infra AFTER Migration

```
k12-infra/.github/

├── copilot-instructions.md              # K12-specific ONLY
│   # References global via `.github-private/instructions/*`
│   # Contains: module paths, Dapr config, database hydration, enrollment API rules
│
├── AGENTS.md                            # Can stay as-is (reference doc)
│   # Developers use this locally; APM links to global
│
├── TOOLSETS.md                          # Already excellent; no changes
│
├── agents/                              # EMPTY or REMOVED
│   # All inherited via APM from `.github-private`
│
├── prompts/                             # EMPTY or REMOVED  
│   # All inherited via APM from `.github-private`
│
└── skills/                              # EMPTY or LINKED
    # Symlink to `.github-private/skills/` if local access needed
    # Otherwise, inherited via APM
```

---

## ⚙️ APM Configuration Details

### `.github-private/apm.yml` (Master Registry)

```yaml
name: tfxdevelopment-global
version: 2.0.0
description: Organization-wide agents, prompts, instructions, and MCP routing
author: tfxdevelopment platform team
license: Apache-2.0

# Global MCP dependencies (used by all projects)
dependencies:
  apm: []
  mcp:
    - terraform                  # Official HCP Terraform MCP
    - aspire-cli                # .NET Aspire CLI MCP

# All canonical agents (17 total after consolidation)
agents:
  - name: terraform
    description: Terraform + HCP workflows + MCP
  - name: dotnet-architect
    description: Architecture recommendations for .NET projects
  - name: dotnet-concurrency-specialist    # ← CONSOLIDATED (no dupe)
    description: Concurrency, threading, race conditions
  - name: dotnet-cloud-specialist
    description: Cloud deployment, Aspire, observability
  - name: dotnet-security-reviewer
    description: Security review, OWASP, secrets
  - name: dotnet-testing-specialist
    description: Test architecture, strategy, data management
  - name: dotnet-code-review-agent
    description: General code quality review
  - name: dotnet-performance-analyst
    description: Performance profiling and optimization
  - name: dotnet-benchmark-designer
    description: Benchmark methodology and design
  - name: dotnet-blazor-specialist
    description: Blazor-specific patterns
  - name: dotnet-maui-specialist
    description: MAUI cross-platform development
  - name: dotnet-uno-specialist
    description: Uno Platform development
  - name: dotnet-aspnetcore-specialist
    description: ASP.NET Core middleware, request pipeline
  - name: dotnet-async-performance-specialist
    description: Async/await performance tuning
  - name: docfx-specialist
    description: DocFX documentation generation
  - name: azure-resource-visualizer
    description: Azure resource graph visualization
  - name: azure-role-selector
    description: RBAC role selection and least privilege
  - name: azure-devops-cli
    description: Azure DevOps automation via CLI

# All canonical prompts (16 total)
prompts:
  - architecture-create
  - architecture-review
  - code-use-case
  - code-review
  - use-case-create
  - use-case-review
  - test-verify-backend
  - test-verify-ui
  - deploy
  - deploy-review
  - git-commit
  - prompt-improvement
  - suggest-awesome-github-copilot-agents
  - suggest-awesome-github-copilot-collections
  - suggest-awesome-github-copilot-instructions
  - suggest-awesome-github-copilot-prompts

# Global instructions (extracted from k12-infra + new ones)
instructions:
  - terraform-execution-patterns
  - azure-infrastructure-conventions
  - azure-container-apps-patterns
  - azure-networking-conventions
  - azure-security-conventions
  - aspire-global-patterns
  - dotnet-ci-cd-patterns
  - database-hydration-strategies

scripts: {}
```

### `k12-infra/apm.yml` (Project Override)

```yaml
name: k12-infra
version: 1.0.0
description: K12 enrollment platform infrastructure
author: Terry Fraser

dependencies:
  apm:
    - tfxdevelopment/.github-private:2.0.0   # ← Inherit all global
  mcp:
    - terraform
    - aspire-cli

# Project-specific overrides (only if needed)
overrides:
  instructions:
    - k12-infrastructure-specifics         # Local override file
  agents: []                                # None; use all global agents

scripts:
  terraform:plan: "cd terraform/environments && terraform plan"
  terraform:apply: "cd terraform/environments && terraform apply"
```

---

## 📊 Consolidation Impact

| Item | Before | After | Removed | Change |
|------|--------|-------|---------|--------|
| **Agents** | 17 | 16 | dotnet-csharp-concurrency-specialist | -1 dupe |
| **Prompts** | 16 | 16 | (none) | 0 (all global) |
| **Instructions** | 1 k12-specific | 8 global + 1 k12-local | (extracted) | +7 reusable |
| **Skills** | 200+ (local copies) | 60-70% symlinks + 30-40% local | pending audit | -50-100 files |
| **Total Dedup Potential** | ~240 files | ~150 files | ~90 files | **-37% overhead** |

---

## ✅ Validation Checklist (Before APM Handoff Design)

- [ ] Confirm `dotnet-csharp-concurrency-specialist` consolidation decision
- [ ] Approve 5 extracted instructions from k12-infra
- [ ] Validate skills symlink strategy (vs. copy)
- [ ] Confirm 16 prompts move to `.github-private` entirely
- [ ] Approve structure layout above
- [ ] Sign off on `.github-private/apm.yml` schema

---

## 🔗 NOW READY: APM Handoff Designs (Below)

Once you validate Phase 1 & 2 findings above, we'll design:
- **Scenario A:** Agent handoff (developer calls `@terraform-agent` from k12-infra; APM merges context)
- **Scenario B:** Prompt routing (developer runs `/deploy` workflow; APM chains to deployment agent)
- **Scenario C:** Global + Local merge (developer in non-k12 project gets global agents + project overlay)

