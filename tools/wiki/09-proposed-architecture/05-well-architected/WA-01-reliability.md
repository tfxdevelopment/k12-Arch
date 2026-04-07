# WA-01: Reliability Assessment - Proposed Architecture

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Azure Well-Architected Framework - Reliability Pillar
- **Scope:** Proposed Azure Container Apps + Hybrid API + Analytics platform
- **Related:** [WA-02 Security](WA-02-security.md), [WA-03 Cost Optimization](WA-03-cost-optimization.md), [MIGRATE-05 Optimization](../09-migration/MIGRATE-05-optimization.md)

## Executive Summary
The proposed platform targets **99.95% service availability** during peak enrollment while keeping recovery operations simple and repeatable. Reliability posture is achieved by combining zone-redundant platform services, health-driven autoscaling, and codified recovery runbooks.

## Reliability Objectives
| Objective | Target | Validation Method |
|---|---:|---|
| Platform availability | 99.95% | Monthly SLA and synthetic checks |
| API p95 latency under load | < 2 seconds | Scheduled load tests |
| Regional recovery objective (RTO) | < 30 minutes | Semi-annual DR exercise |
| Data loss objective (RPO) | < 5 minutes | Geo-replication validation |

## Key Design Decisions
1. **Zone-aware runtime** for all mission-critical workloads in Container Apps environments.
2. **Failure isolation** between enrollment APIs, analytics APIs, and background processing.
3. **Health-first scaling** using KEDA triggers and readiness/liveness probes.
4. **Recovery-by-automation** through infrastructure as code and runbook-driven failover.

## Reliability Implementation Checklist
- [ ] Confirm zone redundancy settings for Container Apps, SQL, and Redis
- [ ] Implement synthetic transaction monitoring for all critical user journeys
- [ ] Configure alert routing and on-call escalation runbooks
- [ ] Execute biannual failover validation in a non-production environment

## Dependencies and Risks
- **Dependency:** Correct environment sizing in ACA workload profiles
- **Dependency:** Reliable telemetry ingestion in Application Insights
- **Risk:** Under-provisioned minimum replicas during enrollment peak windows
- **Mitigation:** Enrollment-season capacity presets and pre-peak validation tests

## References
- [Azure Well-Architected Framework: Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
