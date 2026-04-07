---
title: CAF-01 Strategy
description: Cloud adoption strategy for modernization execution.
---

> Generated from canonical source: `../../09-proposed-architecture/06-cloud-adoption/CAF-01-strategy.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Set cloud-adoption direction for K12 MyPortal modernization and align technology decisions with measurable business outcomes.

## Strategic outcomes

1. Enrollment continuity at peak season demand.
2. Faster delivery of policy and program changes.
3. Strong security and governance posture for student data.
4. Better platform transparency for leadership and operations.

## Business drivers

- Demand variability during enrollment windows.
- Need for better analytics and reporting capabilities.
- Pressure to reduce delivery lead time without lowering quality.

## Cloud adoption approach

### Portfolio focus

- Prioritize workloads that directly impact enrollment and eligibility.
- Defer low-value migration work that does not improve outcomes.

### Architecture direction

- Managed platform first where feasible.
- Event-driven integration for long-running and external workflows.
- Standardized observability and governance controls from day one.

### Operating model

- Shared platform standards with domain-level ownership.
- Product, engineering, and operations alignment on SLOs and cost targets.

## Strategic metrics

- Enrollment completion success rate during peak windows.
- Deployment lead time for high-priority changes.
- Service reliability and incident recovery metrics.
- Cost variance against approved modernization plan.

## Dependencies

- `../README.md`
- `../07-adr-proposed/ADR-PROP-001-container-functions.md`
- `../07-adr-proposed/ADR-PROP-008-no-microservices.md`
