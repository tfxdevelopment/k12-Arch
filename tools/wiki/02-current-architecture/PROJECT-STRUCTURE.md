# Project Structure (Target .NET Monorepo)

This page defines the **target** repository layout for migrating/refactoring K12 applications into a single .NET-first structure.

## Goals

- Keep solution navigation predictable for large teams.
- Use **Clean Architecture** inside each deployable service.
- Provide a **BFF per web app** (orchestrator) with **shared contracts**.
- Enable cloud-native delivery: containers, Aspire, Dapr, OpenTelemetry.

## Top-Level Layout

```
K12/
├── build/                      # Build-time assets (pipelines, generators, legacy)
├── docs/                       # Optional future: curated docs bundles (see wiki/)
├── infra/                      # IaC (Terraform/Bicep)
├── k12-docs/                   # Interactive docs site (Nuxt)
├── wiki/                       # Static architecture wiki (source of truth)
└── src/                        # Product source (this section)
    ├── K12.sln                 # Main solution
    ├── K12.Aspire.sln          # Aspire orchestration solution (subset)
    │
    ├── Contracts/              # Shared contracts (DTOs + integration events)
    │   └── K12.Contracts/
    │
    ├── Bff/                    # One BFF per web app
    │   ├── K12.Bff.Admin/
    │   ├── K12.Bff.Enrollment/
    │   ├── K12.Bff.Providers/
    │   └── K12.Bff.Schools/
    │
    ├── Services/               # Core container services (bounded contexts)
    │   ├── Enrollment/
    │   │   ├── K12.Services.Enrollment.Api/
    │   │   ├── K12.Services.Enrollment.Application/
    │   │   ├── K12.Services.Enrollment.Domain/
    │   │   └── K12.Services.Enrollment.Infrastructure/
    │   └── ...
    │
    ├── BuildingBlocks/         # Reusable libraries (small, stable)
    │   ├── K12.ServiceDefaults/
    │   └── ...
    │
    └── Tools/                  # CLI/tools (optional)
```

## Dependency Rules (Clean Architecture)

### Inside a Core Service

- `*.Domain` has **no** dependencies on other projects.
- `*.Application` depends on `*.Domain`.
- `*.Infrastructure` depends on `*.Application` and `*.Domain`.
- `*.Api` depends on `*.Application` (and optionally `*.Infrastructure` via composition root).

### Cross-Service Dependencies

- Services do **not** reference each other’s `*.Application`/`*.Domain` directly.
- Cross-service calls go through:
  - HTTP (typed clients) and/or
  - Integration events (Service Bus / Dapr pubsub)

## CQRS Guidance

- Use **commands** for writes and **queries** for reads.
- Prefer vertical slices *within* `*.Application` (feature folders) even if the overall architecture is layered.

## Eventing Guidance

- Prefer **integration events** for cross-service communication.
- Use CloudEvents-compatible metadata for all published events.
- Use idempotency + retry + DLQ patterns for async flows.

## Event Sourcing Guidance (Not Default)

Event sourcing is allowed, but only where it is justified by:
- audit/replay requirements,
- complex domain invariants,
- or a need to rebuild read models from an event log.

If event sourcing is used:
- use an outbox pattern for publishing integration events,
- keep event schemas versioned and backward compatible.

## Related

- [BFF / Orchestrators](BFF-ORCHESTRATORS.md)
- [Shared Contracts](CONTRACTS.md)
- [Repository Organization Issues](REPO-ORGANIZATION-ISSUES.md)
