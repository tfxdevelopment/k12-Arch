---
title: WA-03 Cost Optimization
description: Cost optimization guidance for the proposed cloud-native architecture.
---

> Generated from canonical source: `../../09-proposed-architecture/05-well-architected/WA-03-cost-optimization.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Define cost controls and FinOps practices for the proposed platform while preserving reliability and security outcomes.

## Cost objectives

1. Keep modernization spend predictable during enrollment peaks.
2. Tie architecture decisions to measurable business value.
3. Optimize non-production usage without impacting delivery speed.

## Baseline assumptions

- Core services run on Azure Container Apps.
- Data tier spans transactional and analytics workloads.
- Non-prod environments should be elastic and policy-driven.

## Optimization strategy

### Design-time controls

- Right-size workload resource profiles using load-test evidence.
- Use event-driven decoupling to reduce idle compute.
- Cache hot paths to limit repetitive data operations.

### Runtime controls

- Autoscale with floor and ceiling values tied to service tiers.
- Shutdown windows for lower environments when inactive.
- Budget alerts with action playbooks for threshold breaches.

### Governance controls

- Tagging standard: application, owner, environment, cost-center.
- Monthly cost review with architecture, platform, and product leads.
- Reserved or savings plans only after stable utilization is proven.

## Implementation backlog

### Now (0-30 days)

1. Define required cost tags and enforce in deployment templates.
2. Add monthly and forecast budget alerts by environment.
3. Document baseline spend by platform domain.

### Next (30-90 days)

1. Execute right-sizing after peak-load rehearsal.
2. Implement automatic non-prod scale-down windows.
3. Publish cost-to-value dashboard for leadership review.

### Later (90+ days)

1. Introduce reservation strategy where utilization supports commitment.
2. Expand unit economics reporting per major product capability.

## KPIs

- Cost per enrolled application processed.
- Percent of spend tagged and attributable.
- Non-prod idle cost as percent of total non-prod spend.
- Monthly budget variance by environment.

## Dependencies

- `../01-container-apps/CONT-10-cost-model.md`
- `../05-analytics/ANALYTICS-03-dashboard-architecture.md`
- `../10-operations/OPS-03-continuous-improvement.md`

## Legacy reference

Detailed prior cost analysis is retained in `../04-well-architected/WA-03-cost-optimization.md`.
