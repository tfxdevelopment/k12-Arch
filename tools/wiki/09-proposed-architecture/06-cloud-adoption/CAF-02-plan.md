# CAF-02: Plan - Digital Estate and Workload Prioritization

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Cloud Adoption Framework - Plan
- **Related:** [CAF-03 Adopt](CAF-03-adopt.md), [MIGRATE-01 Containerize Functions](../09-migration/MIGRATE-01-containerize-functions.md)

## Planning Scope
The plan phase converts strategic outcomes into a sequenced modernization backlog across APIs, integration workflows, data services, and operational capabilities.

## Workload Prioritization Model
| Priority | Workload | Reason | Planned Sequence |
|---|---|---|---|
| P1 | Enrollment API and eligibility services | Highest user impact and seasonal criticality | Wave 1 |
| P1 | Identity and authorization controls | Compliance and security baseline | Wave 1 |
| P2 | Reporting and analytics APIs | Enables operational visibility and policy decisions | Wave 2 |
| P3 | Non-critical support workflows | Lower business risk, can follow stabilization | Wave 3 |

## Planning Deliverables
- Dependency map for service, data, and integration boundaries
- Migration wave plan with risk and rollback criteria
- Environment readiness checklist (dev/test/stage/prod)
- Resource and skill plan for platform and application teams

## Plan Checklist
- [ ] Validate workload inventory and ownership model
- [ ] Confirm migration wave sequencing with engineering leadership
- [ ] Align acceptance criteria for each wave (performance, security, operability)

## References
- [Cloud Adoption Framework: Plan](https://learn.microsoft.com/azure/cloud-adoption-framework/plan/)
