# ADR 0001: GitOps & Toggle Strategy for Azure Container Apps

## Status
Accepted

## Context
- K12 API is deployed to Azure Container Apps via Terraform modules under `terraform/modules/api-enrollment`.
- Environments are defined in `terraform/environments/<env>` with new toggles for zone redundancy, ACR geo-replication, ILB, and replica/capacity settings.
- We want a repeatable GitOps pipeline that promotes a single image tag across environments while keeping lower envs inexpensive and production highly available.

## Decision
- Use Azure Pipelines for CI/CD.
- Keep dev/staging/testing on Basic/Consumption posture with public ingress; do **not** enable ILB, zone redundancy, or ACR geo-replication there.
- For production, enable ILB, zone redundancy, and ACR geo-replication; raise `aca_min_replicas` to 2+.
- Store and manage toggles in `terraform/environments/<env>/locals.tf`; Terraform is always executed from the corresponding env folder.
- Enforce health endpoints `/health/live`, `/health/ready`, `/health/startup` as deployment gates.

## Consequences
- Pipelines remain split: CI (plan + build/push) vs CD (per-env apply + rollout using existing image tag).
- Cost remains low in non-prod; production incurs higher spend for HA/DR.
- Any change to toggles requires communicating cost/availability impact in PRs and stakeholder reviews (see `docs/aca-review.md`).
- Secrets stay in `{env}apikv` with Managed Identity; ACR admin remains disabled.

## References
- `docs/gitops.md`
- `docs/aca-review.md`
- `terraform/docs/CONTAINER_APPS_SETUP.md`
- `terraform/docs/ACA_PRODUCTION_READINESS.md`
