# K12 MyPortal Architecture Documentation Framework

## Overview

This document establishes the comprehensive architecture documentation framework for K12 MyPortal, following industry-standard practices including C4 Model, arc42, and Architecture Decision Records (ADRs).

## Documentation Framework Structure

```
wiki/
├── 02-architecture/                    # Current State Architecture
│   ├── README.md                       # Architecture Overview
│   ├── ARCHITECTURE-DOCUMENTATION-FRAMEWORK.md  # This document
│   ├── c4-diagrams/                    # C4 Model Diagrams
│   │   ├── 00-architecture-overview.md # Executive Summary
│   │   ├── 01-system-context.md        # Level 1: System Context
│   │   ├── 02-container-diagram.md     # Level 2: Container Diagram
│   │   ├── 03-deployment-diagram.md    # Level 3: Deployment View
│   │   ├── 04-roster-workflow-context.md # Domain: Roster Workflow
│   │   └── 05-rds-integration-context.md # Domain: RDS Integration
│   ├── security/                       # Security Architecture
│   │   ├── README.md                   # Security Overview
│   │   ├── SEC-01-entra-id-configuration.md
│   │   ├── SEC-02-authorization-model.md
│   │   ├── SEC-03-row-level-security.md
│   │   └── SEC-04-audit-logging.md
│   ├── integrations/                   # External Integrations
│   │   ├── README.md                   # Integrations Overview
│   │   ├── INT-01-classwallet-integration.md
│   │   ├── INT-02-pandadoc-integration.md
│   │   ├── INT-03-sendgrid-integration.md
│   │   ├── INT-04-melissa-data-integration.md
│   │   ├── INT-05-nc-dmv-dor-integration.md
│   │   ├── INT-06-nc-dpi-integration.md
│   │   └── INT-07-rds-residency-determination-service.md
│   └── workflows/                      # Business Workflows
│       ├── README.md                   # Workflows Index
│       └── WF-01-roster-to-be-certified.md
├── adr/                                # Architecture Decision Records
│   ├── README.md                       # ADR Index
│   ├── ADR-template.md                 # Standard Template
│   └── ADR-001 through ADR-013         # Accepted Decisions
└── 09-proposed-architecture/           # Future State Architecture
    └── [48 planned documents]
```

## Documentation Standards

### C4 Model Implementation

The K12 MyPortal documentation follows the [C4 Model](https://c4model.com/) for software architecture visualization:

| Level | Name | Purpose | File Pattern |
|-------|------|---------|--------------|
| **1** | System Context | Birds-eye view showing K12 and external systems | `01-system-context.md` |
| **2** | Container | Major technical building blocks (apps, DBs, APIs) | `02-container-diagram.md` |
| **3** | Component | Internal structure of containers | `*-component-diagram.md` |
| **4** | Code | Class/module level (optional) | Inline in technical docs |

#### Diagram Requirements

All architecture diagrams must:
- Use **Mermaid** syntax for version control and maintainability
- Include a title and brief description
- Show relationships with labeled arrows
- Use consistent styling (see style guide below)

#### Mermaid C4 Style Guide

```mermaid
%%{init: {"theme": "default"}}%%
C4Context
    title [Diagram Title]

    %% Actors (Blue)
    Person(user, "User Name", "Description")

    %% Internal Systems (Green)
    System(system, "System Name", "Description")

    %% External Systems (Gray)
    System_Ext(external, "External System", "Description")

    %% Databases (Orange)
    ContainerDb(db, "Database", "Technology", "Description")

    %% Relationships
    Rel(from, to, "Verb phrase", "Protocol")
```

### arc42 Alignment

While not strictly following arc42 templates, the documentation addresses these arc42 sections:

| arc42 Section | K12 Location |
|---------------|--------------|
| 1. Introduction | `wiki/README.md`, `01-project-overview/` |
| 2. Constraints | `adr/` (captured in decision context) |
| 3. Context & Scope | `c4-diagrams/01-system-context.md` |
| 4. Solution Strategy | `02-architecture/README.md` |
| 5. Building Block View | `c4-diagrams/02-container-diagram.md` |
| 6. Runtime View | `workflows/`, `c4-diagrams/` sequences |
| 7. Deployment View | `c4-diagrams/03-deployment-diagram.md` |
| 8. Concepts | `security/`, `integrations/` |
| 9. Design Decisions | `adr/` |
| 10. Quality | `06-operations/`, NFR sections |
| 11. Risks | `07-program-management/` |
| 12. Glossary | `wiki/GLOSSARY.md` (to be created) |

### ADR Standards

Architecture Decision Records follow the MADR (Markdown Architecture Decision Records) format:

```markdown
# ADR-XXX: [Short Title - Verb + Object]

**Status:** Proposed | Accepted | Deprecated | Superseded by [ADR-XXX]
**Date:** YYYY-MM-DD
**Deciders:** [Names]
**Technical Story:** [K12-XXXX] [Jira Link]

## Context and Problem Statement
[What is the issue?]

## Decision Drivers
* [Factor 1]
* [Factor 2]

## Considered Options
* [Option 1]
* [Option 2]

## Decision Outcome
**Chosen option:** "[Option X]", because [justification].

### Consequences
#### Good
- [Positive outcome]

#### Bad
- [Negative outcome]

## Validation
[How will success be measured?]
```

## Documentation Categories

### 1. Current State Architecture (`02-architecture/`)

Documents the **as-is** production system:

| Category | Purpose | Update Frequency |
|----------|---------|------------------|
| C4 Diagrams | Visual architecture | Quarterly or on major changes |
| Security | Auth, authorization, compliance | On security updates |
| Integrations | External system connections | On new integrations |
| Workflows | Business process documentation | On process changes |

### 2. Architecture Decision Records (`adr/`)

Permanent record of significant technical decisions:

| ADR Range | Category | Status |
|-----------|----------|--------|
| ADR-001 to ADR-008 | Foundation (cloud, framework, patterns) | Accepted |
| ADR-009 to ADR-011 | Analytics (query engine, components) | Proposed |
| ADR-012 to ADR-013 | Workflows (orchestration, integration) | Proposed/Accepted |
| ADR-PROP-* | Proposed Architecture | In Review |

### 3. Proposed Architecture (`09-proposed-architecture/`)

Documents the **future-state** target architecture:

| Section | Documents | Priority |
|---------|-----------|----------|
| Container Apps | CONT-01 to CONT-10 | P0 (Critical) |
| .NET Aspire | ASPIRE-01 to ASPIRE-07 | P0 |
| Hybrid API | API-01 to API-06 | P1 |
| Analytics | ANALYTICS-01 to ANALYTICS-05 | P1 |
| Well-Architected | WA-01 to WA-05 | P1 |
| Migration | MIGRATE-01 to MIGRATE-05 | P2 |

## Quality Attributes Documentation

### Non-Functional Requirements Matrix

| Quality Attribute | Target | Documented In |
|-------------------|--------|---------------|
| **Availability** | 99.9% SLA | `02-architecture/README.md` |
| **Scalability** | 100K concurrent users | `c4-diagrams/02-container-diagram.md` |
| **Performance** | <2s API response | Container/deployment docs |
| **Security** | FedRAMP High | `security/README.md` |
| **Compliance** | FERPA, WCAG 2.1 AA | `security/`, `06-operations/` |
| **Disaster Recovery** | RPO 4h, RTO 8h | `06-operations/README.md` |

### Security Documentation Coverage

| Security Domain | Document | Status |
|-----------------|----------|--------|
| Identity Management | SEC-01-entra-id-configuration.md | Complete |
| Authorization | SEC-02-authorization-model.md | Complete |
| Data Protection | SEC-03-row-level-security.md | Complete |
| Audit & Logging | SEC-04-audit-logging.md | Complete |
| Threat Modeling | To be created | Planned |
| Incident Response | `06-operations/` | Partial |

## Documentation Maintenance

### Review Schedule

| Document Type | Review Cycle | Reviewer |
|---------------|--------------|----------|
| C4 Diagrams | Quarterly | Architecture Team |
| ADRs | On change only | Technical Lead |
| Security Docs | Bi-annually | Security Team |
| Integration Docs | On API changes | Integration Lead |
| Proposed Architecture | Weekly during development | Architecture Team |

### Change Management Process

1. **Identify Change**: New feature, bug fix, or technical debt
2. **Impact Assessment**: Determine which docs need updates
3. **Draft Changes**: Update in feature branch
4. **Review**: PR review by Architecture Team
5. **Merge**: Update main documentation
6. **Announce**: Notify stakeholders via Teams/email

### Documentation Health Metrics

Track documentation quality with these metrics:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Documentation Coverage | 100% of major components | Quarterly audit |
| Staleness | <90 days since last review | Automated check |
| Completeness | All required sections filled | PR checklist |
| Accuracy | Matches actual implementation | Quarterly validation |

## Tooling

### Diagram Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **Mermaid** | In-markdown diagrams | C4, sequence, flowcharts |
| **PlantUML** | Complex UML diagrams | Component details |
| **Draw.io** | Freeform diagrams | Brainstorming, presentations |
| **Lucidchart** | Collaborative diagrams | Stakeholder workshops |

### Documentation Site

The wiki is published via:
- **Static**: GitHub/Azure DevOps markdown rendering
- **Interactive**: Nuxt Content site (`k12-docs/`) with:
  - Full-text search
  - Dark mode
  - Auto-generated TOC
  - Responsive design

### Automation

| Automation | Tool | Purpose |
|------------|------|---------|
| Link validation | Markdown lint | Detect broken links |
| Diagram rendering | Mermaid CLI | Pre-render diagrams |
| Doc site build | Nuxt generate | Static site generation |
| ADR numbering | Script | Auto-assign ADR numbers |

## Getting Started

### For Developers

1. Read `02-architecture/README.md` for system overview
2. Review relevant C4 diagrams for your area
3. Check `adr/` for key decisions affecting your work
4. Reference integration docs when working with external systems

### For Architects

1. Start with `02-architecture/ARCHITECTURE-DOCUMENTATION-FRAMEWORK.md` (this doc)
2. Review all ADRs in sequence
3. Understand current vs. proposed architecture
4. Use templates for new documentation

### For New Team Members

1. Read `wiki/README.md` for project context
2. Walk through C4 diagrams (Level 1 → Level 2 → Level 3)
3. Review security architecture
4. Explore integration documentation for external systems

## Related Documentation

- [Architecture Overview](README.md)
- [ADR Index](./../adr/README.md)
- [Proposed Architecture](./../09-proposed-architecture/README.md)
- [Development Guide](./../05-development/README.md)

## Contact

- **Architecture Questions**: CFI Architecture Team (Marty Flournory, Sumith Mathur)
- **Documentation Issues**: Create Jira ticket in K12 project
- **Confluence Space**: [KR Wiki](https://cfi-nc.atlassian.net/wiki/spaces/KR/overview)

---

*Last Updated: December 2025*
*Framework Version: 1.0*
