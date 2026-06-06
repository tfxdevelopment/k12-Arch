# CAF / WAF Multi-Agent Handoff — Project Kickoff

Date: 2026-06-06
Status: In Progress (Wave 1 launched)
Owner: CFI Architecture Team (K12 MyPortal)
Branch: `claude/multi-agent-handoff-caf-waf-t8lU8`
Scope: `tools/wiki/03-target-architecture/cloud-adoption/` (CAF) and `tools/wiki/03-target-architecture/well-architected/` (WAF)

## Purpose

Stand up a repeatable **multi-agent handoff** workflow that completes the K12 MyPortal
**Cloud Adoption Framework (CAF)** and **Azure Well-Architected Framework (WAF)** documentation
to a consistent, citable, FedRAMP-aware standard. This document is the kickoff charter: it
defines the orchestration model, the agent roster, the handoff contract, the work breakdown,
and the acceptance criteria.

## Why a multi-agent handoff

- The CAF/WAF surface is broad (CAF methodologies + 5 WAF pillars) and each section needs a
  different specialist lens (governance, security, reliability, performance, cost, ops).
- Each section is an independent file, so authoring **parallelizes cleanly** with no write contention.
- A single orchestrator preserves cross-document consistency (shared metadata block, shared K12
  facts, shared cross-reference convention) while specialists own depth.

## Orchestration model

```
                    ┌──────────────────────────────┐
                    │   Orchestrator (this session) │
                    │   - holds K12 facts + template │
                    │   - assigns work, reconciles   │
                    │   - writes indexes, commits, PR│
                    └───────────────┬───────────────┘
        ┌───────────────┬───────────┼───────────────┬───────────────┐
        ▼               ▼           ▼               ▼               ▼
   CAF author      WAF Op-Ex    WAF Perf      (WA-01 Reliability  (existing,
   (4 CAF docs)    author       author         WA-02 Security      complete —
                                               WA-03 Cost)         no rework)
```

The orchestrator passes each author a **handoff packet** (below). Authors return only a summary
(file path, line count, citations); the orchestrator never ingests the full subagent transcript,
keeping context bounded.

## Handoff contract (packet every author receives)

| Field | Content |
|-------|---------|
| **Target file(s)** | Absolute path(s) to write — one owner per file, no overlap |
| **Format anchor** | Mirror `well-architected/WA-02-security.md`: H1, `## Metadata`, `## Executive Summary`, themed H2/H3, tables, fenced config, `## References` (Microsoft Documentation + Related K12 Documents) |
| **Grounding** | Use Microsoft Learn MCP (`microsoft_docs_search` / `microsoft_docs_fetch`) before writing; cite the URLs |
| **K12 facts** | Container Apps + Container Functions, .NET 10, Data API Builder, Trino+CubeJS, Redis, Dapr, .NET Aspire, hybrid IaC (Aspire+Terraform); Azure Government Cloud; FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA; ~80K peak-enrollment concurrent users; ESA+ / Opportunity Scholarship; Hub & Spoke Entra ID |
| **Cross-reference rule** | Each doc links the CAF set ↔ the WA-01..WA-05 set |
| **Boundaries** | Touch only assigned files; return a concise summary |

## Agent roster (Wave 1)

| Agent | Specialist lens | Deliverables |
|-------|-----------------|--------------|
| **CAF author** | cloud-architect / migration | `CAF-01-strategy`, `CAF-02-plan`, `CAF-03-adopt`, `CAF-04-govern-manage` |
| **WAF Op-Ex author** | devops / sre | `WA-04-operational-excellence` |
| **WAF Perf author** | performance-engineer | `WA-05-performance-efficiency` |

The orchestrator owns the index READMEs and the project charter (this doc).

## Work breakdown & status

### Cloud Adoption Framework (`cloud-adoption/`)
| Doc | Methodology | Pre-state | Target |
|-----|-------------|-----------|--------|
| CAF-01-strategy | Strategy (motivations, outcomes, financials) | TBD stub | ✍️ Wave 1 |
| CAF-02-plan | Plan (digital estate, rationalization, skilling, backlog) | TBD stub | ✍️ Wave 1 |
| CAF-03-adopt | Adopt (Migrate + Modernize, landing zones) | TBD stub | ✍️ Wave 1 |
| CAF-04-govern-manage | Govern (5 disciplines) + Manage | TBD stub | ✍️ Wave 1 |

### Well-Architected Framework (`well-architected/`)
| Doc | Pillar | Pre-state | Target |
|-----|--------|-----------|--------|
| WA-01-reliability | Reliability | ✅ Complete | No rework |
| WA-02-security | Security | ✅ Complete | No rework / format anchor |
| WA-03-cost-optimization | Cost Optimization | ✅ Complete | No rework |
| WA-04-operational-excellence | Operational Excellence | TBD stub | ✍️ Wave 1 |
| WA-05-performance-efficiency | Performance Efficiency | TBD stub | ✍️ Wave 1 |

## Acceptance criteria

- [ ] All 6 stub files replaced with full assessments (target 300–600 lines each).
- [ ] Every doc carries the standard `## Metadata` block and a `## References` section that
      cites current Microsoft Learn URLs.
- [ ] CAF-04 maps the 5 governance disciplines to K12 controls and covers resource-group /
      RBAC role-assignment best practices (management group → subscription → resource group
      hierarchy, least-privilege custom roles).
- [ ] Cross-references wired between the CAF set and the WA-01..WA-05 set.
- [ ] `cloud-adoption/README.md` and `well-architected/README.md` index pages exist.
- [ ] Changes committed to the branch and a **draft PR** opened against `development`.

## ContextStream note

The team's ContextStream workspace (`K12 Azure`, id `88a586eb-0e78-4841-b4fd-32f080419e2a`,
MCP server `context-awesome`) was configured but its MCP tools did not register in this remote
session, so the **"Azure resource groups and security roles best practices"** chat could not be
pulled in directly. Its subject matter is nonetheless captured first-class in **CAF-04
(Govern — Identity & Security Baseline disciplines)**. Re-run with the ContextStream MCP
reachable to reconcile any additional decisions from that chat.

## Follow-on waves (not in this pass)

- **Wave 2 — Reconciliation:** pull the ContextStream "Azure resource groups and security roles"
  chat once the MCP is reachable; fold decisions into CAF-04 and WA-02.
- **Wave 3 — Validation:** run the doc-health auditor over the new docs (links, TBD markers),
  align with `04-decisions/` ADRs, and graduate Status from Draft → Reviewed.
- **Wave 4 — Publish:** surface CAF/WAF in the VitePress/portal navigation and TechDocs catalog.
