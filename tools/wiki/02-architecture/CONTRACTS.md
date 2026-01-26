# Shared Contracts

This page defines how K12 shares contracts between BFFs and core services.

## Goals

- A single, versioned place for DTOs and integration event schemas.
- BFFs and services can evolve independently without constantly hand-editing duplicated types.

## What Goes in Contracts

### API Contracts

- Request/response DTOs exposed by BFF endpoints.
- Public enums and value types needed by the UI.

### Integration Event Contracts

- Event payload types published across bounded contexts.
- CloudEvents-compatible metadata (event type, source, subject, time).

## What Does Not Go in Contracts

- Domain entities
- Persistence models
- Service-internal commands/queries

## Project Layout

- `src/Contracts/K12.Contracts`

Suggested namespaces:
- `K12.Contracts.Common`
- `K12.Contracts.Admin`
- `K12.Contracts.Enrollment`
- `K12.Contracts.Events.*`

## Versioning

- Use semantic versioning for breaking vs non-breaking changes.
- Prefer additive changes (new optional fields) over breaking changes.
- Avoid reusing enum values for different meanings.

## Relationship to OpenAPI

BFF OpenAPI specs should align with the shared contracts.
If code-first OpenAPI is used, contracts remain the authoritative source for DTOs.
