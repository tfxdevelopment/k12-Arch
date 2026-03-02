# Documentation Organization Guide

**K12 MyPortal Architecture & Documentation Repository**  
Last Updated: February 7, 2026

> **⚠️ NOTE:** ContextStream MCP references in this document are deprecated (not compatible with Windows). Use Context7 and Microsoft Learn MCP servers instead for documentation workflows.

---

## Overview

This guide explains how to organize parsed markdown documents from `sources/` into the canonical documentation structure.

## Current Documentation Structure

### 1. **Memory Bank** (`memory-bank/`)
Persistent context:

```
memory-bank/
├── projectbrief.md           # Project goals, constraints, current focus
├── productContext.md         # Why the project exists, what it solves
├── systemPatterns.md         # Architecture patterns and decisions
├── techContext.md            # Technology stack details
├── activeContext.md          # Current work focus and decisions
├── progress.md               # Completed work, known issues, next steps
└── tasks/
    ├── _index.md            # Task tracking index
    └── TASK-NNN-name.md     # Individual task files with progress logs
```

**Role**: Short-term working memory, decision tracking, and continuous context for agents.

### 2. **Wiki** (`tools/wiki/`)
Canonical architecture knowledge base:

```
wiki/
├── 01-architecture/
│   ├── README.md
│   ├── 01-context-diagram.md         # C4 Level 1: System Context
│   ├── 02-container-diagram.md       # C4 Level 2: Containers
│   ├── 03-component-diagrams/        # C4 Level 3: Components per container
│   ├── 04-code-diagrams/             # C4 Level 4: Class/function level
│   ├── c4-diagrams/                  # Mermaid C4 diagram sources
│   ├── deployment/                   # Infrastructure & K8s architecture
│   └── security/                     # Security architecture and patterns
├── 02-design-patterns/
│   ├── microservices-patterns.md
│   ├── event-driven-architecture.md
│   ├── cloud-native-patterns.md
│   └── [others]
├── 03-standards/
│   ├── naming-conventions.md
│   ├── code-standards.md
│   ├── api-standards.md
│   └── database-standards.md
├── 04-implementation-guides/
│   ├── setup-development-environment.md
│   ├── adding-new-microservice.md
│   ├── database-migrations.md
│   └── deployment-procedures.md
├── 05-operations/
│   ├── monitoring-and-alerting.md
│   ├── incident-management.md
│   ├── disaster-recovery.md
│   └── performance-tuning.md
├── adr/                              # Architectural Decision Records
│   ├── ADR-001-microservices.md
│   ├── ADR-002-event-driven.md
│   ├── ADR-PROP-NNN-*.md            # Proposed ADRs (under discussion)
│   └── [others]
├── TABLE_OF_CONTENTS.md              # Auto-generated TOC
├── DOCUMENTATION-HEALTH-REPORT.md    # Broken links, incomplete sections
├── DOCUMENTATION-INCOMPLETENESS-SCAN.md # Detailed gap analysis
└── wikifull.md                       # Concatenated wiki (for AI consumption)
```

**Role**: Permanent repository of architecture knowledge, decisions, and implementation guidance.

### 3. **Sources** (`sources/`)
Raw materials for documentation:

```
sources/
├── K12_Cloud_Architecture_Modernization.md    # Original architecture doc
├── Sensei-Solution Architecture Document.md   # Initial solution design
├── 9781800562325_ColorImages.md               # Reference images/diagrams
├── K12-2964_attachments/                      # Associated attachments
├── confl/                                     # Confluence export
├── rds_design_temp/                          # Temporary RDS design docs
└── [other raw materials]
```

**Role**: Source materials waiting to be processed, normalized, and integrated into wiki.

---

## Documentation Processing Workflow

### Phase 1: Analyze & Extract (Using ContextStream + Context7)

```bash
# Step 1: Use ContextStream to analyze source documents
context(user_message="Analyze K12_Cloud_Architecture_Modernization.md and extract: architecture patterns, technology decisions, deployment procedures")

# Step 2: Query Context7 for related best practices
context7 query "Microservices architecture patterns Azure ASP.NET Core"
context7 query "Event-driven architecture Dapr patterns"

# Step 3: Fetch Microsoft Learn documentation
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/"
microsoft_docs_search "Azure Well-Architected Framework microservices"

# Step 4: Capture findings in ContextStream memory
memory(action="create_node", type="analysis",
  title="K12 Architecture Analysis",
  content="[extracted patterns, decisions, gaps]")
```

### Phase 2: Normalize & Structure (Create Memory Bank Entries)

```bash
# For each key finding, create or update memory bank entries:

# Example: Architecture decision
session(action="capture", event_type="decision",
  title="Microservices with Event-Driven Pattern",
  content="Use microservices for K12 API + event-driven Dapr for service communication")

# Example: Documentation task
memory(action="create_task",
  title="Document API Gateway architecture",
  plan_id="[documentation-plan-uuid]",
  priority="high")

# Example: Technical context update
# Edit memory-bank/systemPatterns.md to include new pattern discovery
```

### Phase 3: Create Wiki Pages (From Normalized Content)

**Process for each source document section:**

1. **Create the wiki page** (e.g., `wiki/02-design-patterns/api-gateway-pattern.md`)
2. **Add frontmatter** with metadata:
   ```yaml
   ---
   title: API Gateway Pattern
   status: draft|review|published
   author: [contributor]
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   related_adr: ADR-NNN
   related_diagrams: 03-component-diagrams/api-gateway.md
   ---
   ```
3. **Structure content**:
   - Problem statement
   - Solution approach
   - Implementation example (with code or pseudo-code)
   - Trade-offs
   - Related patterns
   - References (Context7 library docs, Microsoft Learn links)
4. **Link to wiki TOC** in `TABLE_OF_CONTENTS.md`
5. **Generate/Update C4 diagrams** if architecture is described

### Phase 4: Create Architectural Decision Records (ADRs)

For significant architectural decisions found in source documents:

```bash
# Create new ADR file: wiki/adr/ADR-0NNN-title.md

# Template:
# ---
# # ADR-NNN: [Title]
# ## Status
# Proposed | Accepted | Deprecated | Superseded by ADR-NNN
#
# ## Context
# [Problem statement, background, constraints]
#
# ## Decision
# [The actual decision made]
#
# ## Consequences
# [Positive and negative impacts]
#
# ## Alternatives Considered
# - [Alternative 1]: [Why rejected]
# - [Alternative 2]: [Why rejected]
#
# ## Related Decisions
# - ADR-NNN: [Related ADR]
#
# ---

# Then capture in ContextStream:
session(action="capture", event_type="decision",
  title="ADR-NNN: [Title created]",
  content="[Decision summary]")
```

---

## Organizing Source Documents

### Mapping Sources to Wiki Sections

| Source Document | Wiki Target Section | Status |
|---|---|---|
| `K12_Cloud_Architecture_Modernization.md` | `01-architecture/` + ADRs | Extract & normalize |
| `Sensei-Solution Architecture Document.md` | `02-design-patterns/` | Extract & normalize |
| `workflow-azure.mmd` | `01-architecture/c4-diagrams/` | Convert to Mermaid |
| `K12-2964_attachments/` | Distribute to relevant sections | Review content |
| `confl/` | Consolidate to wiki | Merge & deduplicate |
| `rds_design_temp/` | `01-architecture/deployment/` | Evaluate & integrate |

### Processing Steps

1. **Read source** with ContextStream:
   ```bash
   context(user_message="Read and summarize K12_Cloud_Architecture_Modernization.md, identify main architecture patterns and technology decisions")
   ```

2. **Extract key sections**:
   - Architecture overview
   - Technology stack decisions
   - Component interactions
   - Deployment architecture
   - Security concerns
   - Performance considerations

3. **Map to wiki structure**:
   - Group related content
   - Identify gaps
   - Find overlaps/duplicates
   - Note which sections need diagrams

4. **Create wiki pages** with proper links and cross-references

5. **Generate/update diagrams**:
   ```bash
   # Use graph(action="dependencies") to auto-generate component diagrams
   graph(action="dependencies", file_path="src/K12.AppHost/Program.cs")
   
   # Create C4 diagrams in tools/wiki/01-architecture/c4-diagrams/
   # Use Mermaid syntax for easy editing
   ```

---

## Using ContextStream for Continuous Documentation

### Document Tracking in Memory Bank

Update `memory-bank/progress.md` with documentation work:

```markdown
## Documentation in Progress

### Architecture Documentation
- [ ] Complete C4 diagrams for all microservices
- [ ] Extract API gateway pattern from source docs
- [ ] Create ADR for event-driven architecture decision
- [ ] Document deployment procedures
- [ ] Update security architecture section

### API Documentation
- [ ] Generate OpenAPI specs from code
- [ ] Create API client examples
- [ ] Document authentication flows

### Operations Documentation
- [ ] Monitoring and alerting setup
- [ ] Incident response procedures
- [ ] Disaster recovery plan
```

### Task Tracking

Create documentation tasks in ContextStream:

```bash
memory(action="create_task",
  title="Extract and document API Gateway pattern",
  description="Extract from K12_Cloud_Architecture_Modernization.md and create wiki/02-design-patterns/api-gateway-pattern.md",
  plan_id="[doc-plan-uuid]",
  priority="high")
```

### Decision Capture

Save documentation decisions:

```bash
session(action="capture", event_type="decision",
  title="Documentation Structure Standardized on C4 Model",
  content="Adopt C4 model (Context -> Container -> Component -> Code) for all architecture diagrams. Mermaid syntax for maintainability.")
```

---

## Automation & Tools

### Wiki Health Report

Weekly scan for documentation gaps:

```bash
.\scripts\generate-wiki-health-report.ps1

# Output files:
# - wiki/DOCUMENTATION-HEALTH-REPORT.md (summary statistics)
# - wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md (detailed gaps)
```

### Documentation Generation from Code

```bash
# Generate C4 diagrams from code structure
graph(action="dependencies", file_path="src/K12.AppHost/")

# Generate OpenAPI spec from minimal APIs
# (Use ASP.NET Core Swagger middleware)

# Generate changelog from ADRs
# (Automated from wiki/adr/ directory)
```

### Documentation Site

```bash
# Located in tools/markdown-site/
# Hosts wiki/ as searchable documentation site
# Regenerate on wiki changes

cd tools/markdown-site
npm install
npm run build
npm run dev  # http://localhost:3000
```

---

## Content Sections Reference

### 01-Architecture

**Purpose**: System structure and design at all C4 levels

Key files:
- Context diagrams (system boundaries)
- Container diagrams (major components + technologies)
- Component diagrams (internal structure)
- Deployment architecture (infrastructure)
- Security architecture (threat models, access patterns)

### 02-Design Patterns

**Purpose**: Reusable architectural patterns used in the system

Key files:
- Microservices patterns
- Event-driven architecture
- Cloud-native patterns
- Data patterns (CQRS, Event Sourcing)
- API patterns (REST, GraphQL, gRPC)

### 03-Standards

**Purpose**: Team conventions and guidelines

Key files:
- Naming conventions
- Code standards (C#, TypeScript)
- API standards (versioning, response formats)
- Database standards (schema, naming, migrations)
- Commit message conventions

### 04-Implementation Guides

**Purpose**: How-to guides for common development tasks

Key files:
- Setting up local development environment
- Adding new microservice
- Database migrations and schema changes
- Testing strategies
- Deployment procedures

### 05-Operations

**Purpose**: Running and maintaining systems in production

Key files:
- Monitoring and alerting
- Logging strategy
- Incident management
- Disaster recovery and backups
- Performance tuning
- Security operations

### ADRs (Architectural Decision Records)

**Purpose**: Record of significant technical decisions and rationale

Naming: `ADR-NNNN-title.md`  
Status: Proposed, Accepted, Deprecated, Superseded  
Lifecycle: Draft → Review → Accepted → (possibly) Superseded/Deprecated

---

## Quality Assurance

### Documentation Review Checklist

- [ ] All links are internal and correct
- [ ] Code examples are tested and current
- [ ] Diagrams are present and accurate
- [ ] Related sections are cross-linked
- [ ] No TODO/TBD/FIXME markers without tracking
- [ ] Writer and date attribution included
- [ ] Technical accuracy verified with Context7
- [ ] Standards compliance checked

### Link Validation

```bash
# Run regularly to identify broken links
.\scripts\generate-wiki-health-report.ps1

# Review: wiki/BROKEN-LINK-FIX-PLAN.md
```

### Incompleteness Tracking

```bash
# Search for unfinished sections
## TODO, TBD, FIXME, K12 markers in wiki

# Review: wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md
# Update: memory-bank/ with tracking
```

---

## Integration with Development

### Update Documentation When Code Changes

When implementing features:

1. **Update relevant wiki sections**:
   - Architecture diagrams if structure changes
   - API standards if new endpoints
   - Implementation guides if process changes

2. **Create/update ADRs** for significant decisions:
   - New microservice pattern
   - Technology choice changes
   - Major refactoring decisions

3. **Track in ContextStream**:
   ```bash
   session(action="capture", event_type="decision",
     title="Implemented [Feature/Pattern]",
     content="Update: wiki/[relevant-section], ADR-NNN")
   ```

4. **Update memory bank**:
   - Modify `memory-bank/activeContext.md` with current focus
   - Update `memory-bank/progress.md` with completion status
   - Create task if documentation gaps remain

### PR Requirements

Include in pull requests:

```markdown
## Documentation Updates

- [ ] Updated wiki/ pages if architecture changed
- [ ] Created/updated ADR if significant decision
- [ ] Updated memory-bank/ if context changed
- [ ] Links verified in updated sections
- [ ] Code examples tested if included
```

---

## Quick Reference: Using MCP to Complete Documentation

### ContextStream Workflow

```bash
# 1. Initialize and get context
init(folder_path="g:\\Projects\\CFI\\K12\\k12-Arch")
context(user_message="I'm working on architecture documentation for microservices")

# 2. Search for related existing docs
search(mode="auto", query="microservices pattern implementation")
search(mode="semantic", query="service communication patterns")

# 3. Capture new findings
memory(action="create_node", type="pattern", title="...", content="...")
session(action="capture", event_type="decision", title="...", content="...")

# 4. Track tasks
memory(action="create_task", title="Document [pattern]", plan_id="[uuid]", priority="high")

# 5. Update progress
memory(action="update_task", task_id="[uuid]", task_status="completed")
```

### Context7 Integration

```bash
# Find latest best practices
context7 query "ASP.NET Core microservices with Dapr"
context7 query "Azure Kubernetes Service patterns 2025"

# Get code samples
context7 query "Entity Framework Core migration patterns example"
```

### Microsoft Learn MCP

```bash
# Search official Microsoft docs
microsoft_docs_search "Azure Well-Architected Framework"
microsoft_docs_search ".NET Aspire cloud-native applications"

# Fetch complete documentation
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/"
```

---

## Next Steps

1. **Review source documents** in `sources/` directory
2. **Extract key content** using ContextStream
3. **Map to wiki structure** using this guide
4. **Create ADRs** for significant decisions
5. **Generate diagrams** using graph analysis
6. **Track progress** in memory-bank/
7. **Validate links** with health report script
8. **Publish documentation site** from tools/markdown-site/

---

**Last Updated**: February 7, 2026  
**Maintained By**: K12 Architecture Team  
**Related**: memory-bank/, tools/wiki/, AGENTS.md
