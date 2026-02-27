# WA-03: Cost Optimization - Proposed Architecture

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Azure Well-Architected Framework - Cost Optimization Pillar
- **Related:** [WA-05 Performance Efficiency](WA-05-performance-efficiency.md), [CAF-04 Govern & Manage](../06-cloud-adoption/CAF-04-govern-manage.md)

## Executive Summary
Cost optimization focuses on predictable enrollment-season spend, measurable unit economics, and governance controls that prevent long-running waste in non-production environments.

## Cost Principles
1. **Spend where it matters:** prioritize enrollment reliability and response time.
2. **Eliminate idle:** aggressively right-size and scale-to-zero for non-critical workloads.
3. **Govern continuously:** budgets, alerts, and anomaly detection are mandatory controls.
4. **Optimize with data:** track cost per transaction and cost per active applicant.

## Cost Control Plan
| Area | Baseline Risk | Optimization Action | Review Cadence |
|---|---|---|---|
| Container Apps | Over-provisioned replicas | Seasonal profile presets and autoscale tuning | Monthly |
| Data platform | Storage growth and retention sprawl | Tiering/retention policies for logs and backups | Monthly |
| Shared services | Unused dev/test resources | Auto-shutdown and lifecycle policies | Weekly |
| Licensing/commitment | Underused reservations | Annual reserved capacity and savings plan review | Quarterly |

## Cost Implementation Checklist
- [ ] Set environment-level budget thresholds and alert routing
- [ ] Define auto-cleanup policies for ephemeral and stale resources
- [ ] Publish cost dashboards for engineering and product leadership
- [ ] Include cost gates in architecture review and release readiness

## References
- [Azure Well-Architected Framework: Cost Optimization](https://learn.microsoft.com/azure/well-architected/cost-optimization/)
