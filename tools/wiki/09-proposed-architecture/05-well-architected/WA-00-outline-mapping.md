# WA-00: Well-Architected Outline & Source Mapping

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-27

## Scope
All five Well-Architected pillars for K12 MyPortal proposed architecture.

## WAF pillar outline
1. Reliability
2. Security
3. Cost Optimization
4. Operational Excellence
5. Performance Efficiency

## Source mapping (initial)

### Reliability
- `WA-01-reliability.md`
- `../01-container-apps/CONT-07-keda-scaling.md`
- `../10-operations/OPS-01-monitoring.md`

### Security
- `WA-02-security.md`
- `../../02-architecture/security/README.md`
- `../../04-standards/STD-02-backend-coding-standards.md`

### Cost Optimization
- `WA-03-cost-optimization.md`
- `../01-container-apps/CONT-10-cost-model.md`
- `../../PIPELINE-ARCHITECTURE.md`

### Operational Excellence
- `WA-04-operational-excellence.md`
- `../10-operations/OPS-02-incident-response.md`
- `../../07-deployment/DEPLOY-03-cicd-pipeline-architecture.md`

### Performance Efficiency
- `WA-05-performance-efficiency.md`
- `../01-container-apps/CONT-07-keda-scaling.md`
- `../../05-testing/LOAD-TEST.md`

## Gaps to resolve
- Add explicit NFR baseline matrix by service.
- Add pillar-specific KPI dashboard source links.
- Add architecture decision traceability links to ADRs for each pillar.
