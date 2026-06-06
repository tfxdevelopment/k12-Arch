# Azure Well-Architected Framework (WAF) — K12 MyPortal

Per-pillar **Azure Well-Architected Framework** assessment of the K12 MyPortal cloud-native
target architecture (Azure Container Apps + .NET 10 + Data API Builder + Trino/CubeJS + Dapr,
on **Azure Government Cloud**, **FedRAMP Moderate**).

These documents assess *how well the workload is designed*; the sibling
[`cloud-adoption/`](../cloud-adoption/README.md) documents describe *how K12 adopts and governs
Azure*. The central engineering constraint across all pillars is supporting **~80,000 concurrent
users at peak enrollment month** while holding FedRAMP Moderate compliance.

## The five pillars

| Doc | Pillar | Status | Focus for K12 |
|-----|--------|--------|---------------|
| [WA-01: Reliability](WA-01-reliability.md) | Reliability | ✅ Complete | Resiliency, multi-replica Container Apps, failover, SLAs |
| [WA-02: Security](WA-02-security.md) | Security | ✅ Complete | Hub & Spoke Entra ID, zero trust, container security, FERPA/FedRAMP |
| [WA-03: Cost Optimization](WA-03-cost-optimization.md) | Cost Optimization | ✅ Complete | +20% vs current / −43% vs AKS microservices; KEDA scale-to-zero economics |
| [WA-04: Operational Excellence](WA-04-operational-excellence.md) | Operational Excellence | ✍️ In progress | DevOps, observability, safe deployment, IaC, incident management |
| [WA-05: Performance Efficiency](WA-05-performance-efficiency.md) | Performance Efficiency | ✍️ In progress | 80K-user scale, KEDA autoscaling, Redis caching, load testing |

## How this maps to Cloud Adoption Framework governance

See the cross-reference table in [`cloud-adoption/README.md`](../cloud-adoption/README.md). In
short: WAF pillars provide the technical assessment that the CAF Govern disciplines turn into
enforceable guardrails (policy, RBAC, cost controls, deployment standards).

## Authoring

Produced and maintained via the
[CAF/WAF Multi-Agent Handoff](../../../../docs/plans/2026-06-06-caf-waf-multi-agent-handoff.md)
workflow. Each pillar doc carries a `## Metadata` block and a `## References` section citing
current Microsoft Learn guidance.
