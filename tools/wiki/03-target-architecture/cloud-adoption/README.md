# Cloud Adoption Framework (CAF) — K12 MyPortal

Microsoft **Cloud Adoption Framework** alignment for the K12 MyPortal cloud-native target
architecture (NC SEAA ESA+ and Opportunity Scholarship programs), on **Azure Government Cloud**
under **FedRAMP Moderate**.

These documents describe *how K12 adopts and governs Azure*; the sibling
[`well-architected/`](../well-architected/README.md) documents assess *how well the workload is
designed* against the five WAF pillars. Read CAF for the adoption journey and governance guardrails;
read WAF for per-pillar technical assessment.

## Documents

| Doc | CAF Methodology | Summary |
|-----|-----------------|---------|
| [CAF-01: Strategy](CAF-01-strategy.md) | Strategy | Motivations, business outcomes, and financial considerations for the K12 cloud-native move |
| [CAF-02: Plan](CAF-02-plan.md) | Plan | Digital estate & rationalization, org alignment, skills readiness, adoption backlog |
| [CAF-03: Adopt](CAF-03-adopt.md) | Migrate + Modernize | Landing-zone readiness and migration/modernization waves to Container Apps + .NET 10 |
| [CAF-04: Govern & Manage](CAF-04-govern-manage.md) | Govern + Manage | Five governance disciplines (incl. resource-group & RBAC baseline) and operations management |

## How this maps to the Well-Architected pillars

| CAF discipline | Strongest WAF pillar link |
|----------------|---------------------------|
| Cost Management | [WA-03 Cost Optimization](../well-architected/WA-03-cost-optimization.md) |
| Security Baseline / Identity Baseline | [WA-02 Security](../well-architected/WA-02-security.md) |
| Resource Consistency / Deployment Acceleration | [WA-04 Operational Excellence](../well-architected/WA-04-operational-excellence.md) |
| Manage (business commitments, SLAs) | [WA-01 Reliability](../well-architected/WA-01-reliability.md) · [WA-05 Performance Efficiency](../well-architected/WA-05-performance-efficiency.md) |

## Authoring

These docs are produced and maintained via the
[CAF/WAF Multi-Agent Handoff](../../../../docs/plans/2026-06-06-caf-waf-multi-agent-handoff.md)
workflow. Each doc carries a `## Metadata` block and a `## References` section citing current
Microsoft Learn guidance.
