# ADR-004: Dapr Sidecars and Components

Status: Proposed
Date: 2025-12-24

## Context
We want ACA-native Dapr enabled for APIs to leverage service invocation, state, and pub/sub while keeping web apps simple.

## Decision
Enable Dapr sidecars only for API containers. Define shared component names across environments (e.g., `statestore`, `pubsub`). For local dev, use Aspire with Dapr components configured via `dapr/` folder.

## Rationale
- Simplicity: Web apps don’t need Dapr; API benefits most.
- Consistency: Common component names aid portability.
- Local parity: Aspire + Dapr keeps local dev close to prod.

## Consequences
- Component management and secrets across envs.
- Requires observability and health dashboards.

## Alternatives
- Dapr everywhere (complexity). 
- No Dapr (lose capabilities).

## References
- Dapr components and configuration docs
- ACA Dapr enablement guidance
