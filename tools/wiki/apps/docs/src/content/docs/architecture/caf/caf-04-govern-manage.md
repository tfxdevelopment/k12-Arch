---
title: CAF-04 Govern and Manage
description: Governance and management controls for cloud operations.
---

> Generated from canonical source: `../../09-proposed-architecture/06-cloud-adoption/CAF-04-govern-manage.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Define governance and management controls that keep cloud adoption sustainable, compliant, and operationally effective.

## Governance outcomes

1. Every workload has an owner, lifecycle, and policy baseline.
2. Security, reliability, and cost controls are measurable and enforceable.
3. Change management and incident response are auditable.

## Governance model

### Policy baseline

- Mandatory tagging and ownership metadata.
- Approved deployment paths and environment protections.
- Standardized identity and secret management controls.

### Risk and compliance

- Periodic control reviews tied to regulatory obligations.
- Exceptions register with expiry and accountable owner.
- Audit trail for privileged changes and sensitive access.

### Cost and performance governance

- Monthly budget and forecast reviews by environment.
- Capacity reviews before known seasonal peaks.
- Cost-to-value scorecard for major platform initiatives.

### Operations governance

- Service ownership map and on-call expectations.
- Runbook quality checks and incident learning loop.
- Quarterly disaster-recovery and readiness exercise.

## Management cadence

- Weekly operations review for active incidents and risks.
- Monthly governance board for policy and exception decisions.
- Quarterly architecture review for modernization progress.

## Dependencies

- `../05-well-architected/WA-02-security.md`
- `../05-well-architected/WA-03-cost-optimization.md`
- `../10-operations/OPS-02-incident-response.md`
