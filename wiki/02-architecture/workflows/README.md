# K12 MyPortal Workflows

This directory contains architecture documentation for business workflows in the K12 MyPortal system.

## Overview

Workflows represent multi-step business processes that orchestrate tasks, events, and state transitions across the system. Each workflow document captures:

- Business context and purpose
- Workflow states and transitions
- Event-driven architecture
- API endpoints and data entities
- Error handling and recovery
- Monitoring and metrics

## Workflow Index

| ID | Workflow | Status | Description |
|----|----------|--------|-------------|
| [WF-01](WF-01-roster-to-be-certified.md) | Roster - To Be Certified | Proposed | Transitions students from completed enrollment to school roster certification |

## Workflow Categories

### Enrollment Workflows
- **HH Application** - Household registration and student enrollment
- **School Selection** - School matching and acceptance
- **Award** - Award determination and acceptance

### Roster Workflows
- **[WF-01] To Be Certified** - Student roster certification process
- **Certify Enrollment** - Final enrollment certification (downstream)

### Payment Workflows
- **Payment Processing** - Disbursement after certification

## Workflow Architecture Pattern

All workflows in K12 MyPortal follow an event-driven architecture:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Trigger Event  │────▶│   Service Bus    │────▶│  Azure Durable   │
│   (API/Task)     │     │   (Event Hub)    │     │  Functions       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
                         ┌─────────────────────────────────┼─────────────────────────────────┐
                         │                                 │                                 │
                         ▼                                 ▼                                 ▼
                ┌──────────────────┐            ┌──────────────────┐            ┌──────────────────┐
                │   Task Service   │            │  Comms Service   │            │  3rd-Party       │
                │   (Create Tasks) │            │  (Notifications) │            │  Services        │
                └──────────────────┘            └──────────────────┘            └──────────────────┘
```

## Related Documentation

- [System Architecture](../README.md)
- [Azure Infrastructure](../azure-infrastructure.md)
- [C4 Architecture Diagrams](../c4-diagrams/)
- [Architecture Decision Records](../../adr/)

## Adding New Workflows

When documenting a new workflow:

1. Use the naming convention: `WF-{NUMBER}-{workflow-name}.md`
2. Follow the structure in existing workflow documents
3. Include all required sections (see WF-01 as template)
4. Update this README index
5. Create an ADR if architectural decisions are involved
6. Update `TABLE_OF_CONTENTS.md`

---

*For workflow questions, contact the CFI Architecture team.*
