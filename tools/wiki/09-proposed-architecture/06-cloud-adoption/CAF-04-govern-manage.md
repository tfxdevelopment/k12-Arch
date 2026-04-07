# CAF-04: Govern and Manage - Sustainable Cloud Operations

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Cloud Adoption Framework - Govern and Manage
- **Related:** [WA-03 Cost Optimization](../05-well-architected/WA-03-cost-optimization.md), [OPS-03 Continuous Improvement](../10-operations/OPS-03-continuous-improvement.md)

## Governance Focus Areas
- **Policy compliance:** enforce baseline controls through policy-as-code.
- **Cost governance:** budgets, ownership tagging, and anomaly alerts.
- **Operational governance:** service ownership, support model, and incident SLAs.
- **Security governance:** periodic access review and control validation.

## Operating Guardrails
| Domain | Guardrail |
|---|---|
| Resource hygiene | Mandatory tags: owner, environment, cost-center, data-classification |
| Change control | Protected branches + CI policy gates before environment updates |
| Security posture | Continuous vulnerability and configuration drift scanning |
| Reliability posture | Mandatory quarterly DR and game-day exercises |

## Govern and Manage Checklist
- [ ] Publish cloud policy baseline and exception process
- [ ] Define monthly governance review with engineering and business stakeholders
- [ ] Implement KPI dashboard for cost, reliability, security, and delivery metrics
- [ ] Track and close governance findings with named owners

## References
- [Cloud Adoption Framework: Govern](https://learn.microsoft.com/azure/cloud-adoption-framework/govern/)
- [Cloud Adoption Framework: Manage](https://learn.microsoft.com/azure/cloud-adoption-framework/manage/)
