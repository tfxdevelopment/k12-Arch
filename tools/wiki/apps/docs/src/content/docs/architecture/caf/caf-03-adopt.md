---
title: CAF-03 Adopt
description: Cloud adoption onboarding and migration workflow.
---

> Generated from canonical source: `../../09-proposed-architecture/06-cloud-adoption/CAF-03-adopt.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Define the repeatable workload-adoption pattern used to move teams and services onto the target cloud platform.

## Adoption model

1. Discover and classify workload risk.
2. Prepare architecture and readiness checklist.
3. Migrate with controlled rollout.
4. Stabilize and hand off to operations.

## Workload onboarding checklist

### Discovery

- Identify critical user journeys and data domains.
- Document dependency graph and integration contracts.
- Define performance and reliability targets.

### Readiness

- Verify deployment template and configuration standards.
- Validate auth, secret, and network control alignment.
- Add baseline telemetry and alerting.

### Migration

- Deploy to staging using revision strategy.
- Run functional, performance, and resilience tests.
- Execute canary release and rollback validation.

### Stabilization

- Confirm dashboard and runbook completeness.
- Close open risks and track residual technical debt.
- Transfer ownership to steady-state operating model.

## Team enablement

- Standard project template for APIs and workers.
- Shared engineering playbooks for platform conventions.
- Office hours model for migration blockers.

## Dependencies

- `../02-aspire/ASPIRE-02-local-development.md`
- `../02-aspire/ASPIRE-05-deployment-azd.md`
- `../05-well-architected/WA-04-operational-excellence.md`
