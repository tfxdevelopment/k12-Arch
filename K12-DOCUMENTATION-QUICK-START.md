# K12 Architecture Documentation - Quick Reference Guide

**Visual Organization & MCP Integration Overview**

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Sources of Truth                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📄 Source Documents          📚 Memory Bank                 │
│  (sources/)                   (memory-bank/)                  │
│  ┌──────────────────┐        ┌──────────────────┐           │
│  │ Cloud Architecture│        │ projectbrief.md  │           │
│  │ Sensei Doc       │        │ productContext.  │           │
│  │ Confluence Exp   │        │ systemPatterns.  │           │
│  │ RDS Design       │        │ techContext.md   │           │
│  └──────────────────┘        │ activeContext.   │           │
│         │                     │ progress.md      │           │
│         │                     │ tasks/           │           │
│         └──────────┬──────────┘                 │           │
│                    │                            │
│                    ▼                            │
│  ┌────────────────────────────────────────┐   │           │
│  │    PROCESSING WITH MCP SERVERS         │   │           │
│  ├────────────────────────────────────────┤   │           │
│  │ • ContextStream: Analyze, extract      │   │           │
│  │ • Context7: Find best practices         │   │           │
│  │ • Microsoft Learn: Fetch official docs │   │           │
│  └────────────────────────────────────────┘   │           │
│                    │                          │           │
│                    ▼                          ▼           │
│         ┌──────────────────────┐                          │
│         │  wiki/               │                          │
│         │  (Canonical Docs)    │                          │
│         └──────────────────────┘                          │
│         ┌──────────────────────┐                          │
│         │ 01-architecture/     │                          │
│         │ 02-design-patterns/  │                          │
│         │ 03-standards/        │                          │
│         │ 04-impl-guides/      │                          │
│         │ 05-operations/       │                          │
│         │ adr/                 │                          │
│         └──────────────────────┘                          │
│                    │                                      │
│                    ▼                                      │
│      Documentation Site                                  │
│      (tools/markdown-site/)                             │
│      http://localhost:3000                              │
│                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## MCP Server Integration Map

### Three MCP Servers Working Together

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Documentation Work                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CONTEXTSTREAM│ │  CONTEXT7    │ │ MICROSOFT    │
│              │ │              │ │ LEARN        │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ • Init       │ │ • Query      │ │ • Search     │
│ • Context   │ │ • Latest     │ │ • Fetch      │
│ • Search    │ │ • Best       │ │ • Code       │
│ • Session   │ │ • Practices  │ │ • Samples    │
│ • Memory    │ │ • Code       │ │ • Guidelines │
│ • Graph     │ │ • Examples   │ │              │
│ • Project   │ │              │ │              │
│ • Workspace │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │              │              │
        │ Purpose      │ Purpose      │ Purpose
        │              │              │
        ▼              ▼              ▼
    Persistent    Latest Best     Official
    Memory &      Practices &     Guidance &
    Task          Code Examples   Standards
    Management
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │   Complete Your          │
        │  Architecture Docs       │
        │   and Standards          │
        └──────────────────────────┘
```

---

## Documentation Structure & Content Types

```
wiki/
│
├── 01-architecture/                ← System Design (C4 Model)
│   ├── 01-context-diagram.md       What is the system? (Level 1)
│   ├── 02-container-diagram.md     Major components? (Level 2)
│   ├── 03-component-diagrams/      Internal structure? (Level 3)
│   ├── 04-code-diagrams/           How does code work? (Level 4)
│   ├── c4-diagrams/                Mermaid diagram sources
│   ├── deployment/                 How deployed? (K8s, Docker, etc)
│   └── security/                   How protected? (Auth, encryption)
│
├── 02-design-patterns/             ← Reusable Solutions
│   ├── microservices-patterns.md
│   ├── event-driven-architecture.md
│   ├── cloud-native-patterns.md
│   ├── api-patterns.md
│   └── data-patterns.md
│
├── 03-standards/                   ← Team Conventions
│   ├── naming-conventions.md
│   ├── code-standards-csharp.md
│   ├── code-standards-typescript.md
│   ├── api-standards.md
│   └── database-standards.md
│
├── 04-implementation-guides/       ← How-To Guides
│   ├── setup-dev-environment.md
│   ├── adding-new-microservice.md
│   ├── database-migrations.md
│   ├── deployment-procedures.md
│   └── testing-strategy.md
│
├── 05-operations/                  ← Running Production
│   ├── monitoring-and-alerting.md
│   ├── incident-management.md
│   ├── disaster-recovery.md
│   ├── performance-tuning.md
│   └── security-operations.md
│
├── adr/                            ← Decision History
│   ├── ADR-0001-*.md               Accepted decisions
│   ├── ADR-PROP-*.md               Proposed decisions
│   └── [deprecated ADRs]
│
├── TABLE_OF_CONTENTS.md            ← Navigation
├── DOCUMENTATION-HEALTH-REPORT.md  ← Quality Report
└── wikifull.md                     ← For AI consumption
```

---

## Workflow: Extract → Process → Document → Validate

```
Source Document (sources/)
         │
         ▼
╔════════════════════╗
║  PHASE 1: ANALYZE  ║ Using ContextStream + Context7
║                    ║ • Read source
╚════════════════════╝ • Extract patterns
         │           • Get best practices
         ▼           • Research decisions
    ContextStream
    - create_node (analysis)
    - search (related patterns)
    - graph (code dependencies)
         │
         ▼
╔════════════════════╗
║  PHASE 2: EXTRACT  ║ Using ContextStream + Microsoft Learn
║                    ║ • Identify key sections
╚════════════════════╝ • Map to wiki structure
         │           • Fetch official guidance
         ▼           • Create task list
    Memory Bank
    - create_task (documentation work)
    - session (capture decision)
         │
         ▼
╔════════════════════╗
║  PHASE 3: CREATE   ║ Using Context7 for examples
║                    ║ • Write wiki pages
╚════════════════════╝ • Create ADRs
         │           • Add code examples
         ▼           • Generate diagrams
    wiki/ Pages
    - 01-architecture/
    - 02-design-patterns/
    - 03-standards/
    - 04-impl-guides/
    - 05-operations/
    - adr/
         │
         ▼
╔════════════════════╗
║  PHASE 4: VALIDATE ║ Using wiki health report
║                    ║ • Check links
╚════════════════════╝ • Fill gaps
         │           • Verify examples
         ▼           • Update progress
    Health Report
    ✓ DOCUMENTATION-HEALTH-REPORT.md
    ✓ DOCUMENTATION-INCOMPLETENESS-SCAN.md
         │
         ▼
╔════════════════════╗
║  COMPLETE & TRACK  ║ Using ContextStream
║                    ║ • Update progress.md
╚════════════════════╝ • Mark tasks complete
         │           • Capture lessons learned
         ▼
    memory-bank/
    ✓ Updated progress.md
    ✓ Task marked complete
    ✓ Future agents informed
```

---

## Your Documentation Checklist

### Getting Started (Week 1)

- [ ] Read AGENTS.md (this file + original)
- [ ] Read DOCUMENTATION-ORGANIZATION-GUIDE.md
- [ ] Read MCP-DOCUMENTATION-INTEGRATION.md
- [ ] Review sources/ directory contents
- [ ] Initialize ContextStream: `context(user_message="...")`
- [ ] Start documentation task list

### Architecture Phase (Week 2-3)

- [ ] Extract system context from source docs
- [ ] Create C4 Level 1: Context Diagram
  - Command: `context(user_message="Summarize K12 system context")`
- [ ] Create C4 Level 2: Container Diagram
  - Command: `graph(action="dependencies", file_path="src/K12.AppHost/")`
- [ ] Create C4 Level 3: Component Diagrams
  - Command: `search(mode="semantic", query="microservice components")`
- [ ] Create ADRs for Key Decisions
  - Command: `context7 query "architecture decision patterns"`

### Patterns & Standards Phase (Week 4)

- [ ] Extract design patterns from source docs
- [ ] Document each pattern: wiki/02-design-patterns/
- [ ] Create code standards: wiki/03-standards/
- [ ] Create API standards: wiki/03-standards/
- [ ] Create database standards: wiki/03-standards/

### Implementation Guides Phase (Week 5-6)

- [ ] Create setup guide: wiki/04-implementation-guides/
- [ ] Create microservice guide: wiki/04-implementation-guides/
- [ ] Create deployment guide: wiki/04-implementation-guides/
- [ ] Create testing guide: wiki/04-implementation-guides/

### Operations Phase (Week 7)

- [ ] Create monitoring guide: wiki/05-operations/
- [ ] Create incident response: wiki/05-operations/
- [ ] Create DR procedures: wiki/05-operations/

### Validation & Publication (Week 8)

- [ ] Run health report: `.\scripts\generate-wiki-health-report.ps1`
- [ ] Fix broken links: Review BROKEN-LINK-FIX-PLAN.md
- [ ] Fill gaps: Review DOCUMENTATION-INCOMPLETENESS-SCAN.md
- [ ] Verify all diagrams present
- [ ] Verify code examples are current
- [ ] Build documentation site: `npm run build` in tools/markdown-site/
- [ ] Publish and announce

---

## Quick Command Reference

### Initialize ContextStream

```bash
context(user_message="I'm documenting K12 architecture from sources")
```

### Search for Existing Content

```bash
search(mode="auto", query="microservices architecture")
search(mode="semantic", query="service communication patterns")
```

### Create Documentation Tasks

```bash
memory(action="create_task",
  title="Document [pattern/guide]",
  plan_id="[uuid]",
  priority="high")
```

### Analyze Code Structure

```bash
graph(action="dependencies", file_path="src/K12.AppHost/Program.cs")
graph(action="impact", symbol_name="ServiceClass")
```

### Get Best Practices from Context7

```bash
context7 query "microservices ASP.NET Core best practices 2025"
```

### Fetch Official Documentation

```bash
microsoft_docs_search "Azure Kubernetes Service architecture"
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/"
```

### Track Progress

```bash
memory(action="update_task", task_id="[uuid]", task_status="completed")
session(action="capture", event_type="decision", title="...", content="...")
```

### Generate Health Report

```bash
.\scripts\generate-wiki-health-report.ps1
```

---

## Key Files Created

📄 **This Repository Now Includes**:

1. **AGENTS.md** (Updated)
   - agents.md format sections
   - Setup, development, testing, code style, build
   - ContextStream integration rules

2. **DOCUMENTATION-ORGANIZATION-GUIDE.md** (New)
   - How wiki structure works
   - Processing workflow for source documents
   - Quality assurance checklist

3. **MCP-DOCUMENTATION-INTEGRATION.md** (New)
   - Practical workflows using MCP servers
   - Command examples for each documentation phase
   - Templates for pattern docs and guides

4. **K12-DOCUMENTATION-QUICK-START.md** (This File)
   - Visual overview
   - Quick reference commands
   - Implementation checklist

---

## Next Steps

### Immediate (Today)

1. ✅ Review these documentation files
2. ✅ Initialize ContextStream
3. ✅ Start documentation task list in ContextStream

### This Week

4. Run through MCP-DOCUMENTATION-INTEGRATION.md Phase 1 (Analysis)
5. Extract key content from sources/
6. Create C4 diagrams for system architecture

### This Month

7. Follow weekly phases to complete all documentation sections
8. Use health report to identify and fill gaps
9. Publish documentation site

---

## Resources

- **agents.md Format**: https://agents.md/
- **C4 Model**: https://c4model.com/
- **Microsoft Well-Architected Framework**: https://learn.microsoft.com/en-us/azure/well-architected/
- **ContextStream Documentation**: https://contextstream.io/docs/
- **Cloud-Native .NET Architecture**: https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/

---

**Created**: February 7, 2026  
**Status**: Ready for Implementation  
**Maintained By**: K12 Architecture Team + AI Agents
