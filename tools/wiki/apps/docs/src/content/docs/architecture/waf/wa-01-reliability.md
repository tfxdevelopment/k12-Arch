---
title: WA-01 Reliability
description: Reliability guidance for the proposed cloud-native architecture.
---

> Generated from canonical source: `../../09-proposed-architecture/05-well-architected/WA-01-reliability.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Define the reliability strategy for K12 MyPortal as it moves to Azure Container Apps, Dapr, and a split data and analytics architecture.

## Business targets

1. Sustain enrollment peak traffic with predictable latency.
2. Keep core user flows available during platform component faults.
3. Recover quickly from regional or service-level incidents.

## Reliability objectives

- Availability target: 99.95 percent for critical APIs.
- RTO target: less than 30 minutes for tier-1 incidents.
- RPO target: 15 minutes for transactional data in primary scope.
- P95 API latency target under peak: less than 2 seconds for business operations.

## Current risks

1. Single-path dependency risk in the legacy request chain.
2. Limited standardized runbook ownership for cross-team incidents.
3. Inconsistent readiness and liveness guardrails across services.

## Target architecture controls

### Platform resilience

- Multi-zone Azure Container Apps environment for critical workloads.
- Minimum replica floor for cold-start sensitive services.
- Revision-based rollout with canary traffic shifting and fast rollback.

### Data resilience

- Azure SQL HA and geo-replication for priority datasets.
- Redis tier selection based on failover and persistence needs.
- Backup and restore validation executed on a recurring schedule.

### Application resilience

- Retry, timeout, and circuit-breaker policies for external calls.
- Idempotent handlers for event-driven consumers.
- Graceful degradation paths for non-critical dependencies.

### Operations and validation

- Synthetic health probes for top user journeys.
- Incident runbooks with owner, escalation path, and SLA clock.
- Chaos testing plan for dependency failure, network delay, and scale stress.

## Implementation backlog

### Now (0-30 days)

1. Enforce readiness and liveness probes on all API workloads.
2. Define reliability SLO dashboard and weekly review cadence.
3. Add rollback playbook for container revisions.

### Next (30-90 days)

1. Run controlled failover exercise for data and API tier.
2. Implement scenario-based chaos tests in staging.
3. Validate autoscale rules against enrollment month test traffic.

### Later (90+ days)

1. Expand cross-region automation for disaster recovery drills.
2. Formalize error budget policy per critical domain.

## KPIs

- API availability by workload tier.
- Mean time to detect and mean time to recover.
- Failed deployment rollback time.
- Percentage of incidents with complete runbook adherence.

## Dependencies

- `../01-container-apps/CONT-07-keda-scaling.md`
- `../10-operations/OPS-01-monitoring.md`
- `../10-operations/OPS-02-incident-response.md`

## Legacy reference

Detailed prior reliability analysis is retained in `../04-well-architected/WA-01-reliability.md`.
