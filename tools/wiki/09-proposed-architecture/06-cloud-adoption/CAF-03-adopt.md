# CAF-03: Adopt - Migration and Modernization Execution

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Cloud Adoption Framework - Adopt
- **Related:** [CAF-02 Plan](CAF-02-plan.md), [MIGRATE-05 Optimization](../09-migration/MIGRATE-05-optimization.md)

## Adoption Approach
Adopt phase execution uses incremental migration waves, each with explicit go/no-go criteria, rollback paths, and post-cutover validation.

## Migration Principles
1. **Migrate safely:** deploy in small batches with rollback automation.
2. **Modernize with intent:** only introduce platform complexity that is justified by measurable outcomes.
3. **Validate continuously:** performance, security, and reliability checks are required per wave.
4. **Enable teams:** platform enablement and runbook adoption are part of each release.

## Wave Execution Template
| Phase | Entry Criteria | Exit Criteria |
|---|---|---|
| Prepare | Dependencies mapped, tests green, rollback verified | Environment and release readiness approved |
| Migrate | Workload deployed with controlled traffic shift | Functional + non-functional validation complete |
| Stabilize | Observability and incident workflows active | SLOs and support handoff accepted |

## Adopt Checklist
- [ ] Define wave-level go/no-go criteria and rollback controls
- [ ] Validate migration cutover plan for peak enrollment timing constraints
- [ ] Capture lessons learned and update subsequent wave backlog

## References
- [Cloud Adoption Framework: Adopt](https://learn.microsoft.com/azure/cloud-adoption-framework/adopt/)
