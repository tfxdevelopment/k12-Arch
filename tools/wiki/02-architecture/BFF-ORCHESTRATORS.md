# BFF / Orchestrators

This page defines how K12 uses **Backend-for-Frontend (BFF)** services.

## Summary

- Each web app gets its **own BFF**.
- A BFF is an **orchestrator**: it coordinates calls to core services and external integrations.
- BFFs consume and produce **shared contracts** so frontends stay consistent.

## BFF Responsibilities

- API aggregation and orchestration
- UI-shaped endpoints (page/screen-oriented)
- Authorization and policy enforcement at the experience boundary
- Caching and rate limiting for UI workloads
- Translation between external systems and internal domain models (without leaking vendor specifics to the UI)

## Non-Responsibilities

- Owning core business rules (those belong in core services)
- Becoming a shared “god gateway” for all apps

## BFFs in This Solution

- `K12.Bff.Admin`
- `K12.Bff.Enrollment`
- `K12.Bff.Providers`
- `K12.Bff.Schools`

## Contracts

BFFs should:
- depend on `K12.Contracts` for DTOs and event contracts,
- avoid duplicating request/response shapes across BFFs.

See [Shared Contracts](CONTRACTS.md).

## Observability and Resilience

- Use OpenTelemetry for traces/metrics/logs.
- Use timeouts, retries, and circuit breakers for downstream calls.
- Support correlation IDs end-to-end.

## Eventing

BFFs may subscribe to integration events to refresh caches or update read models, but should not become the primary source of truth.
