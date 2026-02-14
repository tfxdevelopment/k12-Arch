# Redirect: Event Schema and Versioning (moved)

This ADR has moved to the canonical ADR folder:

- [ADR-PROP-event-schema-versioning.md](./../../adr/ADR-PROP-event-schema-versioning.md)

This file is a redirect stub preserved for link compatibility.
# ADR: Event Schema and Versioning Standards

Date: 2025-12-11
Status: Proposed
Decision Type: Architecture

## Context

Event producers and consumers need a consistent schema to enable interoperability, observability, and safe evolution of contracts over time.

## Decision

Adopt a common event envelope with required fields and a semantic versioning strategy. Enforce consumer contract tests and idempotency.

## Event envelope (required)

- `eventId`: globally unique identifier (UUID).
- `eventType`: domain-qualified type (e.g., `k12.roster.application-submitted`).
- `version`: semantic version string (e.g., `1.2`).
- `occurredAt`: ISO-8601 timestamp (UTC).
- `correlationId`: ties events to a request or workflow.
- `causationId`: id of the triggering event/command.
- `tenantId`: tenant or customer context.
- `environment`: `dev`, `test`, `prod`.
- `payload`: JSON object with domain-specific data.

## Versioning policy

- Backward-compatible changes (additive fields) may increment minor version.
- Breaking changes require a new major version; do not overwrite existing event types.
- Producers should support dual-publish during migrations; consumers upgrade on their schedule.

## Contract testing

- Maintain consumer-driven contract tests validating required fields and constraints.
- Use CI gates to prevent publishing events that violate schema contracts.

## Idempotency and ordering

- Consumers must implement idempotent processing keyed by `eventId` or domain id.
- Use Service Bus sessions for strict per-aggregate ordering when required.

## Operational guidance

- Enforce payload size < 256 KB; store large documents externally and include references.
- Log envelope metadata for tracing; propagate `correlationId` across HTTP and messaging.

## References

- OPS-messaging runbook: `wiki/09-proposed-architecture/OPS-messaging.md`
- ADR: Azure Service Bus standardization: `ADR-PROP-azure-service-bus-standard.md`
